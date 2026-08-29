
import os

base_dir = r'C:\Users\ADMIN\.gemini\antigravity\scratch\netflix-cinema-project'
expo_dir = os.path.join(base_dir, 'netflix-clone-expo')
src_dir = os.path.join(expo_dir, 'src')
swift_dir = os.path.join(base_dir, 'NetflixClone-iOS')

def write_file(rel_path, content, is_swift=False):
    target = os.path.join(swift_dir if is_swift else expo_dir, rel_path)
    os.makedirs(os.path.dirname(target), exist_ok=True)
    with open(target, 'w', encoding='utf-8') as f:
        f.write(content.strip())
    print('Created:', rel_path)

print('Starting file generation...')
