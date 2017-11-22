# KHU-2017-2-Capstone2-RENEW
### 설명
- 경희대학교 캡스톤 디자인2 프로젝트
- 박정현, 황진하
- 드론을 이용한 인터넷 제공 시스템 구축`

## 진행
- client app beta version 1.0.0 완성.

## RENEW
- 기존 git master가 꼬여서 코드가 중구난방이 되었음.
- 이전 단계는 실험적 단계였고, 이제부터는 전체 구조를 설계 후 진행 할 예정.
- 전체적인 구조가 refactoring이 되어 새로 git을 생성.


## google maps
- https://developers.google.com/maps/documentation/javascript/3.exp/reference?hl=ko

## color picker
- https://www.w3schools.com/colors/colors_picker.asp

## boot strap 
- https://v4-alpha.getbootstrap.com/components/buttons/

## 서버 실행 commands
```
node app --config=clientApp // clientApp 실행.
ps -ef | grep app.js // app.js 실행 중인  node app들 조회
ps -ef | awk '/app.js/{print $2}' | xargs -I{} lsof -Pan -p {} -i // app.js 실행 중인 node app들의 포트를 조회
```
#### 포트
- clientApp :  3000 (고정)
- dataGenerator : 3001 (고정)
- serviceMonitor : 3002 (고정)
- serviceExecutor : (동적 할당)
 - serviceExecutor에서는 
            console.log(process.debugPort)를 출력 하여 포트를 알려줄 수 있다.