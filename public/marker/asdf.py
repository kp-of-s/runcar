import pandas as pd
import os

def split_csv_by_type(input_filepath, type_column='유형'):
    """
    하나의 CSV 파일을 특정 컬럼의 값에 따라 여러 개의 CSV 파일로 나눕니다.

    Args:
        input_filepath (str): 입력 CSV 파일 경로.
        type_column (str): 분할 기준으로 사용할 컬럼 이름. 기본값은 '유형'.
    """
    try:
        # CSV 파일 읽기
        df = pd.read_csv(input_filepath)
        print(f"'{input_filepath}' 파일을 성공적으로 읽었습니다.")

        # '유형' 컬럼이 존재하는지 확인
        if type_column not in df.columns:
            print(f"오류: '{type_column}' 컬럼이 파일에 존재하지 않습니다.")
            return

        # '유형' 컬럼의 고유값 추출
        unique_types = df[type_column].unique()
        print(f"'{type_column}' 컬럼의 고유값: {unique_types}")

        # 결과를 저장할 디렉토리 생성
        output_dir = 'output_files'
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            print(f"'{output_dir}' 디렉토리를 생성했습니다.")

        # 고유값 별로 파일 분할 및 저장
        for type_value in unique_types:
            # 해당 유형에 속하는 데이터 필터링
            df_subset = df[df[type_column] == type_value]
            
            # 파일명에 사용할 수 있도록 유효하지 않은 문자 치환
            safe_type_value = str(type_value).replace('/', '_').replace('\\', '_')
            output_filepath = os.path.join(output_dir, f"{safe_type_value}.csv")
            
            # CSV 파일로 저장 (인덱스 제외)
            df_subset.to_csv(output_filepath, index=False)
            print(f"'{output_filepath}' 파일에 {len(df_subset)}개의 행을 저장했습니다.")

        print("\n모든 작업이 완료되었습니다! 🎉")

    except FileNotFoundError:
        print(f"오류: 지정된 파일 '{input_filepath}'을 찾을 수 없습니다. 파일 경로를 확인해주세요.")
    except Exception as e:
        print(f"처리 중 오류가 발생했습니다: {e}")

# 스크립트 실행
if __name__ == "__main__":
    # 사용 예시: 'data.csv' 파일을 '유형' 컬럼 기준으로 분할
    # 이 파일을 실행하기 전에, 같은 디렉토리에 'data.csv' 파일을 준비해주세요.
    split_csv_by_type('ICJC.csv')