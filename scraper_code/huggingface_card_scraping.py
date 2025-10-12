import git
import os
import pandas as pd
import yaml
import json
from tqdm import tqdm
import time
import shutil

def parse_dataset_card(card_text):
    if card_text is None:  # README가 없는 경우 처리
        return {
            'yaml_metadata': '{}',
            'markdown_content': None
        }
        
    try:
        # YAML과 Markdown 분리
        parts = card_text.split('---\n')
        if len(parts) >= 3:  # YAML 프론트매터가 있는 경우
            yaml_content = parts[1]
            markdown_content = '---\n'.join(parts[2:])
            
            # YAML 파싱
            yaml_data = yaml.safe_load(yaml_content)
            
            return {
                'yaml_metadata': json.dumps(yaml_data),  # JSON 문자열로 변환
                'markdown_content': markdown_content.strip()
            }
        else:  # YAML 프론트매터가 없는 경우
            return {
                'yaml_metadata': '{}',  # 빈 JSON 객체
                'markdown_content': card_text.strip()
            }
    except Exception as e:
        print(f"Error parsing: {e}")
        return {
            'yaml_metadata': '{}',
            'markdown_content': card_text.strip()
        }

def get_dataset_card(dataset_id, username, token):
    try:
        # 저장할 경로 설정
        name = dataset_id.replace('/', '_')
        file_path = f'dataset_repo/{name}'
        
        if os.path.exists(file_path):
            shutil.rmtree(file_path)
        os.makedirs(file_path)
        
        try:
            # git 초기화 및 sparse checkout 설정
            repo = git.Repo.init(file_path)
            origin = repo.create_remote('origin', f'https://{username}:{token}@huggingface.co/datasets/{dataset_id}')
            
            # sparse checkout 설정
            repo.git.sparse_checkout('init')
            repo.git.sparse_checkout('set', 'README.md')
            
            origin.fetch()
            repo.git.checkout('origin/main')
            
            # README.md 읽기
            readme_path = os.path.join(file_path, 'README.md')
            if not os.path.exists(readme_path):
                print(f'No README.md file found for {dataset_id}')
                shutil.rmtree(file_path)
                return None
                
            with open(readme_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            shutil.rmtree(file_path)
            return content
            
        except git.exc.GitCommandError as e:
            if '403' in str(e):
                print(f"Access denied for dataset {dataset_id} (403 error)")
            else:
                print(f"Git error for {dataset_id}: {e}")
            if os.path.exists(file_path):
                shutil.rmtree(file_path)
            return None
            
        except Exception as e:
            print(f"Error accessing {dataset_id}: {e}")
            if os.path.exists(file_path):
                shutil.rmtree(file_path)
            return None
            
    except Exception as e:
        print(f"Error processing {dataset_id}: {e}")
        if os.path.exists(file_path):
            shutil.rmtree(file_path)
        return None
    
def main(lang_code='ja'):
    # CSV 파일 읽기
    input_csv = f'huggingface_datasets_{lang_code}.csv'
    output_csv = f'./Data/dataset_cards_{lang_code}.csv'
    
    print(f"Processing datasets for language: {lang_code}")
    print(f"Reading from: {input_csv}")
    print(f"Will save to: {output_csv}")
    
    df = pd.read_csv(input_csv)
    
    # HuggingFace 인증 정보
    # 환경 변수나 설정 파일에서 가져오세요
    username = os.getenv('HF_USERNAME', 'your-username')
    token = os.getenv('HF_TOKEN', 'your-token-here')
    
    # 데이터프레임 준비
    results = []
    
    # 각 데이터셋의 카드 내용 수집
    for idx, row in tqdm(df.iterrows(), total=len(df), desc=f"Fetching {lang_code} dataset cards"):
        dataset_id = row['id']
        try:
            card_content = get_dataset_card(dataset_id, username, token)
            parsed_content = parse_dataset_card(card_content)
            
            # 결과를 딕셔너리로 저장 (에러가 나도 저장)
            result = {
                'dataset_id': dataset_id,
                'yaml_metadata': parsed_content['yaml_metadata'],
                'markdown_content': parsed_content['markdown_content']
            }
        except Exception as e:
            print(f"Error processing {dataset_id}: {e}")
            # 에러 발생시에도 None으로 저장
            result = {
                'dataset_id': dataset_id,
                'yaml_metadata': '{}',
                'markdown_content': None
            }
        
        results.append(result)
        time.sleep(1)  # API 제한 고려
    
    # 저장할 디렉토리 확인 및 생성
    os.makedirs(os.path.dirname(output_csv), exist_ok=True)
    
    results_df = pd.DataFrame(results)
    results_df.to_csv(output_csv, index=False)
    
    print(f"\nCollected {len(results)} dataset cards")
    print(f"Results saved to: {output_csv}")

if __name__ == "__main__":
    import argparse
    
    # 커맨드 라인 인자 파싱
    parser = argparse.ArgumentParser(description='Collect dataset cards for a specific language')
    parser.add_argument('--lang', type=str, default='ja', 
                        help='Language code (e.g., ja, zh, ko)')
    args = parser.parse_args()
    
    # dataset_repo 폴더 생성
    os.makedirs('dataset_repo', exist_ok=True)
    
    # 메인 함수 실행
    main(args.lang)