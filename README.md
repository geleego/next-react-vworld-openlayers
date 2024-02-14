# next-react-vworld-openlayers
React 프로젝트에 VWORLD 지도를 활용하여 Openlayers로 지도 조작
- 개발 환경: React, Next.js, Ant Design, Styled Components

## API URL & DB Connection Setting
```bash
.env
    API_URL= # Python API (:5000)
    GEO_URL= # Geoserver (:8080)
    VWORLD_KEY= # VWORLD API KEY
```

## GIT (형상관리)
### 1. git-flow 세팅 
```bash
git flow init 
# or
git flow init -f

Branch name for production release: production
Branch name for "next release" development: develop
... [defaults] # select default value (enter)
```
### 2. git feature branch
```bash
#. 브런치 생성 방법 ( 주로 기능별로 feature 생성)
git flow {origin branch name} start {create branch name}

#. 개발 진행 중인 feature 공유
  # feature 소유자
git flow feature publish {feature branch name}

  # feature 사용자
git flow feature pull origin {feature branch name}

#. feature 개발 완료한 소유자가 feature source 커밋
git push # push source to {create branch name} 

#. 전체 개발 완료 후 merge 요청
git flow feature finish {feature branch name}
```
### 3. feature 개발 중 develop 가져오기
```bash
feature branch > git merge --no-ff origin/develop
```

## 프로젝트 세팅 Node 버전
```
v16.14.2
```

## 프로젝트 설치 명령어
```
yarn install
```

### 개발 서버 가동 명령어
```
yarn dev
```

### 프로젝트 배포용 파일 생성 명령어
```
yarn build
```

### 패키지 캐시 삭제 명령어
```bash
 yarn cache clean
```

## 디렉토리
```bash
📦next-react-vworld-openlayers
 ┣ 📂components         # 어플리케이션 기능에 사용되는 폴더
 ┃ ┣ 📂commons            # 공통 컴포넌트 폴더
 ┃ ┃ ┣ 📂maps               # 지도와 관련된 공통 컴포넌트 폴더
 ┃ ┃ ┃ ┣ 📜BaseMap.js         # 기본 지도 파일
 ┃ ┃ ┃ ┣ 📜CenterPosition.js  # 지도 중심 위치 이동 파일
 ┃ ┃ ┃ ┣ 📜CommonFn.js        # 지도 관련 함수 모음 파일
 ┃ ┃ ┃ ┣ 📜Drawing.js         # 지도 위 그리기 파일
 ┃ ┃ ┃ ┣ 📜MousePosition.js   # 지도 위 마우스 위치 이동 파일
 ┃ ┃ ┃ ┣ 📜ScaleLine.js       # 지도 스케일 라인 파일
 ┃ ┃ ┃ ┗ 📜ZoomSlider.js      # 지도 줌 슬라이더 파일
 ┃ ┃ ┣ 📜Headers.js         # header 영역 파일
 ┃ ┃ ┣ 📜NumFormats.js      # 숫자 포맷팅 파일
 ┃ ┃ ┗ 📜useWindowSize.js   # window size 계산 파일
 ┃ ┣ 📂dashboards         # 대시보드 페이지에서 사용하는 컴포넌트 폴더
 ┃ ┃ ┣ 📜DashBoard.js       # 기본 대시보드 파일
 ┃ ┃ ┣ 📜DashMap.js         # 대시보드에 표출되는 지도 파일
 ┃ ┃ ┗ 📜DashRegion.js      # 대시보드 지도에 표출되는 지역 파일
 ┃ ┣ 📂mapviews           # 맵 뷰 페이지에서 사용하는 컴포넌트 폴더
 ┃ ┃ ┣ 📜Maps.js            # 지도 관련 파일
 ┃ ┃ ┗ 📜Widget.js          # 지도 위 위젯 파일
 ┃ ┗ 📜AppLayout.js       # 모든 페이지에서 공통적으로 사용하는 레이아웃 폴더
 ┣ 📂lib                # 데이터를 가져오는 공통 함수가 정의된 폴더
 ┃ ┗ 📜api.js             # 데이터를 가져오는 공통 함수 파일
 ┣ 📂pages              # 페이지를 담당하는 컴포넌트 폴더 (폴더구조로 url 결정)
 ┃ ┣ 📜index.js           # 초기 호출 화면 설정 파일
 ┃ ┣ 📜map.js             # 맵 뷰 호출 페이지 파일
 ┃ ┗ 📜_app.js            # 각 페이지별 공통 부분 리펙토링하는 파일
 ┣ 📂public             # 프로젝트 정적 자산 데이터가 들어가는 폴더
 ┃ ┗ 📂icons              # 지도에 사용되는 아이콘 파일 모음 폴더
 ┣ 📜.babelrc           # 특정 플러그인에 대한 babel 설정 파일
 ┣ 📜.env               # 기본 CRUD API와 GEO API의 url 및 VWORLD KEY 설정 파일
 ┣ 📜.eslintrc.js       # eslint 설정 파일
 ┣ 📜.gitignore         # git 버전 관리 제외 파일 목록 설정 파일
 ┣ 📜.prettierrc.js     # prettier 설정 파일
 ┣ 📜next.config.js     # next 세팅 설정 파일
 ┣ 📜package.json       # 패키지 모듈 세팅 설정 파일
 ┣ 📜README.md          # readme 파일
 ┗ 📜styles.css         # 전역 스타일 모음 파일
```

## 패키지 모듈
### 프로젝트 의존성
- 메인 의존성 (dependencies)
``` 
 - build시, 해당 라이브러리들이 함께 배포됨
 - 아래의 명령어들을 통해 세팅함
 - yarn add <package>          
   - <package>: 설치할 라이브러리 명칭
```
| 패키지 | 버전 | 설명 | 
| ------ | ------ | ------ |
| antd | 4.2.0 | react 프로젝트에서 쉬운 ui 개발을 위한 라이브러리 |
| axios | 0.19.2 | promise 기반 HTTP 통신 라이브러리 |
| font-awesome | 4.7.0 | react 프로젝트에서 쉬운 백터 아이콘 커스텀 사용을 위한 라이브러리 |
| moment | 2.26.0 | 날짜와 시간 데이터를 쉽게 사용하고 검증 하기 위한 라이브러리 |
| next | 9.3.6 | react 프로젝트에서 ssr, ssg를 위한 라이브러리 |
| ol | 6.2.1 | 웹 페이지에서 쉽게 동적 지도 사용 및 지리 정보 활용을 위한 라이브러리 |
| pg | 8.0.0 | postgresql 데이터베이스를 사용하기 위한 라이브러리 |
| proj4 | 2.6.1 | 지리 좌표계를 변환하기 위한 라이브러리 |
| react | 16.13.1 | 사용자 인터페이스를 만들기 위한 js 라이브러리 |
| react-dom | 16.7.0 | react 프로젝트에서 dom 작업을 위한 라이브러리 |
| react-grid-layout | 0.18.3 | 반응형 크기 및 위치 조정이 가능한 그리드 레이아웃 시스템 구현을 위한 라이브러리 ||
| styled-components | 5.0.1 | js 안에 css를 작성하기 위한 라이브러리 |

- 개발 의존성 (devDependencies)
``` 
 - build시, 해당 라이브러리들이 함께 배포 되지 않음
 - 개발에서만 사용되는 라이브러리들을 세팅 
 - 아래의 명령어를 통해 세팅함
 - yarn add <package> --dev
   - <package>: 설치할 라이브러리 명칭
``` 
| 패키지 | 버전 | 설명 | 
| ------ | ------ | ------ |
| @babel/core | 7.9.0 | 바벨의 핵심 기능을 포함하기 위한 라이브러리 |
| @babel/node | 7.8.7 | 트랜스파일링 후 한번에 실행하기 위한 라이브러리 |
| @babel/preset-env | 7.9.0 | es6 -> es5 문법으로 사용할 수 있도록 트랜스파일링 하기 위한 라이브러리 |
| @babel/preset-react | 7.9.4 | react에서 jsx로 작성된 코드들을 createElement 함수를 이용한 코드로 변환하기 위한 라이브러기 |
| babel-loader | 8.1.0 | babel을 webpack으로 파일을 번들링할 때도 실행하게 하기 위한 라이브러리 |
| babel-plugin-import | 1.9.1 | babel용 모듈 import 플러그인으로, antd 번들 사이즈를 줄이기 위한 라이브러리 |
| babel-plugin-styled-components | 1.10.7 | styled-components의 디버그를 편하게 하기 위한 라이브러리 |
| eslint | 6.8.0 | js 코드를 분석해 문법적 오류나 패턴을 식별해 일관된 스타일로 작성하기 위한 라이브러리 |
| eslint-config-airbnb | 18.1.0 | 코드를 분석해서 문법적 오류나 패턴을 식별해 airbnb의 일관된 스타일로 작성하기 위한 라이브러리 |
| husky | 4.2.5 | git hook 설정을 위한 라이브러리 |
| lint-staged | 10.2.2 | eslint 자동화를 위한 라이브러리 |
| prettier | 2.0.5 | 코드 포맷팅을 위한 라이브러리 |
| webpack | 4.42.1 | 모듈 번들러를 위한 라이브러리 |
