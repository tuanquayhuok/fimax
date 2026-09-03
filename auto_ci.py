import sys
import os
import time
import json
import ssl
import subprocess
import urllib.request
import urllib.error

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

ctx = ssl._create_unverified_context()
REPO = "tuanquayhuok/fimax"

def run_cmd(cmd, cwd=None):
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=cwd, encoding='utf-8', errors='replace')
    return res.returncode, res.stdout.strip(), res.stderr.strip()

def get_github_token():
    # Try git credential fill
    try:
        proc = subprocess.run(
            ["git", "credential", "fill"],
            input="protocol=https\nhost=github.com\n",
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        for line in proc.stdout.splitlines():
            if line.startswith("password="):
                return line.split("=", 1)[1].strip()
    except Exception:
        pass
    return os.getenv("GITHUB_TOKEN", "")

TOKEN = get_github_token()

def get_headers():
    h = {
        "User-Agent": "Antigravity-AutoCI/2.0",
        "Accept": "application/vnd.github.v3+json"
    }
    if TOKEN:
        h["Authorization"] = f"Bearer {TOKEN}"
    return h

def api_get(endpoint):
    url = f"https://api.github.com/repos/{REPO}/{endpoint}"
    req = urllib.request.Request(url, headers=get_headers())
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=25) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return None

def get_job_logs(job_id):
    url = f"https://api.github.com/repos/{REPO}/actions/jobs/{job_id}/logs"
    class NoAuthRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            return urllib.request.Request(newurl)
    
    opener = urllib.request.build_opener(NoAuthRedirect, urllib.request.HTTPSHandler(context=ctx))
    req = urllib.request.Request(url, headers=get_headers())
    try:
        with opener.open(req) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except Exception as e:
        return f"Could not fetch logs: {e}"

def get_head_commit():
    _, out, _ = run_cmd("git rev-parse HEAD")
    return out

def git_push_changes(message=None):
    if not message:
        message = f"fix(ci): auto-update build pipeline {time.strftime('%Y-%m-%d %H:%M:%S')}"
    
    print(f"📦 [Git] Kiểm tra thay đổi và chuẩn bị commit...")
    run_cmd("git add .")
    
    _, status, _ = run_cmd("git status --porcelain")
    if not status:
        print("ℹ️  [Git] Không có file thay đổi mới.")
    else:
        print(f"📝 [Git] Commit: {message}")
        code, out, err = run_cmd(f'git commit -m "{message}"')
        if code != 0:
            print(f"⚠️  [Git Commit]: {out or err}")
            
    print("🚀 [Git] Đang đẩy code lên GitHub (origin/main)...")
    code, out, err = run_cmd("git push origin main")
    if code != 0:
        print(f"❌ [Git Push Thất Bại]: {err or out}")
        return False, None
    
    head_commit = get_head_commit()
    print(f"✅ [Git Push Thành Công] HEAD Commit: {head_commit[:8]}")
    return True, head_commit

def find_run_for_commit(commit_sha, max_wait=60):
    print(f"⏳ [GitHub Actions] Đang chờ workflow khởi động cho commit {commit_sha[:8]}...")
    start_time = time.time()
    while time.time() - start_time < max_wait:
        data = api_get("actions/runs?per_page=10")
        if data and "workflow_runs" in data:
            for r in data["workflow_runs"]:
                if r.get("head_sha") == commit_sha or commit_sha.startswith(r.get("head_sha", "")):
                    return r
        time.sleep(3)
    
    data = api_get("actions/runs?per_page=1")
    if data and "workflow_runs" in data and len(data["workflow_runs"]) > 0:
        return data["workflow_runs"][0]
    return None

def watch_run(run_id):
    print(f"\n👀 [Theo Dõi Trực Tiếp] Đang quan sát Run ID: {run_id}")
    run_url = f"https://github.com/{REPO}/actions/runs/{run_id}"
    print(f"🔗 URL: {run_url}")
    
    start_time = time.time()
    last_printed_step = ""
    
    while True:
        run_data = api_get(f"actions/runs/{run_id}")
        if not run_data:
            time.sleep(5)
            continue
            
        status = run_data.get("status")
        conclusion = run_data.get("conclusion")
        elapsed = int(time.time() - start_time)
        
        jobs_data = api_get(f"actions/runs/{run_id}/jobs")
        step_info = ""
        failed_job_id = None
        failed_step = None
        
        if jobs_data and "jobs" in jobs_data and len(jobs_data["jobs"]) > 0:
            job = jobs_data["jobs"][0]
            for s in job.get("steps", []):
                if s.get("conclusion") == "failure":
                    failed_step = s.get("name")
                    failed_job_id = job.get("id")
                elif s.get("status") == "in_progress":
                    step_info = s.get("name")
        
        if status in ["queued", "waiting"]:
            print(f"\r⏱️  [{elapsed}s] Trạng thái: Đang xếp hàng chờ runner khả dụng...", end="", flush=True)
        elif status == "in_progress":
            msg = f"⏱️  [{elapsed}s] Đang thực thi: {step_info or 'Khởi tạo runner...'}"
            if msg != last_printed_step:
                print(f"\n{msg}", end="", flush=True)
                last_printed_step = msg
            else:
                print(f"\r{msg}", end="", flush=True)
        elif status == "completed":
            print("\n" + "="*60)
            if conclusion == "success":
                print(f"🎉🎉🎉 BUILD IOS IPA HOÀN TẤT THÀNH CÔNG RỰC RỠ! 🎉🎉🎉")
                print(f"⏱️  Tổng thời gian: {elapsed} giây")
                print(f"📦 GitHub Releases: https://github.com/{REPO}/releases")
                print(f"📥 Artifacts Tải Về: {run_url}")
                print("="*60 + "\n")
                return True, None
            else:
                print(f"❌❌❌ BUILD THẤT BẠI (Conclusion: {conclusion}) ❌❌❌")
                print(f"🛑 Bước bị lỗi: {failed_step or 'Không xác định'}")
                print(f"🔗 Link chi tiết: {run_url}")
                
                log_excerpt = ""
                if failed_job_id:
                    print(f"📥 Đang tải log chi tiết từ job {failed_job_id}...")
                    logs = get_job_logs(failed_job_id)
                    lines = logs.splitlines()
                    err_lines = [l for l in lines if any(k in l.lower() for k in ["error:", "fatal:", "** build failed **", "failed"])]
                    print("\n--- CÁC DÒNG BÁO LỖI CHÍNH ---")
                    if err_lines:
                        for el in err_lines[:25]:
                            print(f"⚠️  {el}")
                    else:
                        print("\n".join(lines[-35:]))
                    log_excerpt = "\n".join(lines[-40:])
                print("="*60 + "\n")
                return False, log_excerpt
                
        time.sleep(5)

def main():
    commit_msg = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else None
    
    if "--watch-only" in sys.argv:
        latest = api_get("actions/runs?per_page=1")
        if latest and "workflow_runs" in latest and len(latest["workflow_runs"]) > 0:
            run_id = latest["workflow_runs"][0]["id"]
            watch_run(run_id)
        return

    ok, head_sha = git_push_changes(commit_msg)
    if not ok:
        sys.exit(1)
        
    run = find_run_for_commit(head_sha)
    if not run:
        print("❌ Không tìm thấy workflow run vừa tạo.")
        sys.exit(1)
        
    success, _ = watch_run(run["id"])
    if not success:
        sys.exit(2)

if __name__ == "__main__":
    main()
