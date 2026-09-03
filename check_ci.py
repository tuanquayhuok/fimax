import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import urllib.request
import urllib.error
import ssl

ctx = ssl._create_unverified_context()
REPO = "tuanquayhuok/fimax"

def api_get(endpoint):
    url = f"https://api.github.com/repos/{REPO}/{endpoint}"
    req = urllib.request.Request(url, headers={"User-Agent": "CI-Monitor", "Accept": "application/vnd.github.v3+json"})
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        print(f"API Error ({url}): {e}")
        return None

def get_latest_run():
    data = api_get("actions/runs?per_page=5")
    if not data or "workflow_runs" not in data or len(data["workflow_runs"]) == 0:
        return None
    return data["workflow_runs"][0]

def get_job_steps(run_id):
    data = api_get(f"actions/runs/{run_id}/jobs")
    if not data or "jobs" not in data:
        return []
    return data["jobs"]

def get_step_logs(job_id):
    url = f"https://api.github.com/repos/{REPO}/actions/jobs/{job_id}/logs"
    req = urllib.request.Request(url, headers={"User-Agent": "CI-Monitor"})
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            return response.read().decode("utf-8", errors="replace")
    except Exception as e:
        return f"Could not fetch logs: {e}"

if __name__ == "__main__":
    latest = get_latest_run()
    if latest:
        print(f"Latest Run: #{latest['run_number']} (ID: {latest['id']})")
        print(f"Commit: {latest['head_commit']['message']}")
        print(f"Status: {latest['status']}, Conclusion: {latest['conclusion']}")
        
        jobs = get_job_steps(latest['id'])
        for job in jobs:
            print(f"\nJob: {job['name']} ({job['status']}, {job['conclusion']})")
            for step in job.get('steps', []):
                print(f"  [{step.get('conclusion', step.get('status'))}] {step['name']}")
            
            if job.get('conclusion') == 'failure':
                print(f"\n--- LOGS FOR FAILED JOB {job['id']} ---")
                logs = get_step_logs(job['id'])
                lines = logs.splitlines()
                for line in lines:
                    if "error" in line.lower() or "fatal" in line.lower() or "failed" in line.lower() or "npm ERR" in line:
                        print(f"ERR: {line}")
                print("\n--- LAST 40 LINES ---")
                print("\n".join(lines[-40:]))
