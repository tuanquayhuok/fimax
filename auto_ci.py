import sys
import os
import time
import json
import ssl
import subprocess
import urllib.request
import urllib.error

# Ensure UTF-8 output in Windows PowerShell/cmd
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

ctx = ssl._create_unverified_context()
REPO = "tuanquayhuok/fimax"

def run_cmd(cmd, cwd=None):
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=cwd, encoding='utf-8', errors='replace')
    return res.returncode, res.stdout.strip(), res.stderr.strip()

def get_head_commit():
    _, out, _ = run_cmd("git rev-parse HEAD")
    return out

def git_push_changes(message=None):
    if not message:
        message = f"fix(ci): auto-update build pipeline {time.strftime('%Y-%m-%d %H:%M:%S')}"
    
    print(f"📦 [Git] Đang kiểm tra thay đổi...")
    run_cmd("git add .")
    
    _, status, _ = run_cmd("git status --porcelain")
    if not status:
        print("ℹ️  [Git] Không có thay đổi mới nào để commit.")
    else:
        print(f"📝 [Git] Commit: {message}")
        code, out, err = run_cmd(f'git commit -m "{message}"')
        if code != 0:
            print(f"⚠️  [Git Commit]: {out or err}")
            
    print("🚀 [Git] Đang push lên GitHub origin main...")
    code, out, err = run_cmd("git push origin main")
    if code != 0:
        print(f"❌ [Git Push Thất Bại]: {err or out}")
        return False, None
    
    head_commit = get_head_commit()
    print(f"✅ [Git Push Thành Công] HEAD Commit: {head_commit[:8]}")
    return True, head_commit

def api_get(endpoint):
    url = f"https://api.github.com/repos/{REPO}/{endpoint}"
    req = urllib.request.Request(url, headers={
        "User-Agent": "AutoCI-Watcher/1.0",
        "Accept": "application/vnd.github.v3+json"
    })
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return None

def find_run_for_commit(commit_sha, max_wait=60):
    print(f"⏳ [GitHub Actions] Đang chờ GitHub kích hoạt workflow cho commit {commit_sha[:8]}...")
    start_time = time.time()
    while time.time() - start_time < max_wait:
        data = api_get("actions/runs?per_page=10")
        if data and "workflow_runs" in data:
            for r in data["workflow_runs"]:
                if r.get("head_sha") == commit_sha or commit_sha.startswith(r.get("head_sha", "")):
                    return r
        time.sleep(4)
    # Fallback to latest run
    data = api_get("actions/runs?per_page=1")
    if data and "workflow_runs" in data and len(data["workflow_runs"]) > 0:
        return data["workflow_runs"][0]
    return None

def watch_run(run_id):
    print(f"\n👀 [Giám Sát Build] Bắt đầu theo dõi Run ID: {run_id}")
    run_url = f"https://github.com/{REPO}/actions/runs/{run_id}"
    print(f"🔗 Link Actions: {run_url}")
    
    start_time = time.time()
    last_step_name = ""
    
    while True:
        run_data = api_get(f"actions/runs/{run_id}")
        if not run_data:
            time.sleep(6)
            continue
            
        status = run_data.get("status")         # queued, in_progress, completed
        conclusion = run_data.get("conclusion") # success, failure, cancelled, etc.
        elapsed = int(time.time() - start_time)
        
        # Get active step
        jobs_data = api_get(f"actions/runs/{run_id}/jobs")
        step_info = ""
        failed_step = None
        
        if jobs_data and "jobs" in jobs_data and len(jobs_data["jobs"]) > 0:
            job = jobs_data["jobs"][0]
            steps = job.get("steps", [])
            for s in steps:
                s_status = s.get("status")
                s_concl = s.get("conclusion")
                if s_concl == "failure":
                    failed_step = s.get("name")
                elif s_status == "in_progress":
                    step_info = s.get("name")
        
        if status in ["queued", "waiting"]:
            print(f"\r⏱️  [{elapsed}s] Trạng thái: Đang xếp hàng (Queued)...", end="", flush=True)
        elif status == "in_progress":
            display = f"⏱️  [{elapsed}s] Đang chạy bước: {step_info or 'Khởi tạo runner...'}"
            if display != last_step_name:
                print(f"\n{display}", end="", flush=True)
                last_step_name = display
            else:
                print(f"\r⏱️  [{elapsed}s] Đang chạy bước: {step_info or 'Đang xử lý...'}", end="", flush=True)
        elif status == "completed":
            print(f"\n\n=======================================================")
            if conclusion == "success":
                print(f"🎉🎉🎉 CHÚC MỪNG! BUILD IOS IPA THÀNH CÔNG RỰC RỠ! 🎉🎉🎉")
                print(f"⏱️  Tổng thời gian: {elapsed} giây")
                print(f"📦 Release Link: https://github.com/{REPO}/releases")
                print(f"📥 Artifacts Link: {run_url}")
                print("=======================================================\n")
                return True
            else:
                print(f"❌❌❌ BUILD THẤT BẠI (Conclusion: {conclusion}) ❌❌❌")
                print(f"🛑 Bước bị lỗi: {failed_step or 'Không xác định'}")
                print(f"🔗 Xem chi tiết log tại: {run_url}")
                print("=======================================================\n")
                return False
                
        time.sleep(8)

def main():
    commit_msg = sys.argv[1] if len(sys.argv) > 1 else None
    
    if len(sys.argv) > 1 and sys.argv[1] == "--watch-only":
        latest = api_get("actions/runs?per_page=1")
        if latest and "workflow_runs" in data:
            run_id = latest["workflow_runs"][0]["id"]
            watch_run(run_id)
        return

    # Step 1: Auto push
    ok, head_sha = git_push_changes(commit_msg)
    if not ok:
        sys.exit(1)
        
    # Step 2: Auto find triggered workflow
    run = find_run_for_commit(head_sha)
    if not run:
        print("❌ Không tìm thấy workflow run nào vừa kích hoạt.")
        sys.exit(1)
        
    # Step 3: Auto watch & notify
    success = watch_run(run["id"])
    if not success:
        sys.exit(2)

if __name__ == "__main__":
    main()
