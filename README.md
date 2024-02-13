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

## develop

### GIT (형상관리)
#### 1. git-flow 세팅 
```bash
git flow init 
# or
git flow init -f

Branch name for production release: production
Branch name for "next release" development: develop
... [defaults] # select default value (enter)
```
#### 2. git feature branch
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
#### 3. feature 개발 중 develop 가져오기
```bash
feature branch > git merge --no-ff origin/develop
```

### 프로젝트 개발모드 실행 방법 (yarn 사용)
```bash
 # install and start
 yarn && yarn dev
```
#### package cache clean (오래된 패키지 삭제 (버전관리))
```bash
 yarn cache clean
```
#### package install
```bash
 yarn
 # or
 yarn install
```
#### running
```bash
 yarn dev
 # or
 yarn run dev
```