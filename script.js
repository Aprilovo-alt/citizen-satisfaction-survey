/* =========================================================
   《公民满意度调查》
   SCRIPT
   ========================================================= */


/* =========================================================
   1. 调查问题
   ========================================================= */

const questions = [

    {
        text: "您对目前的生活状况是否满意？",
        options: [
            "非常满意",
            "满意",
            "一般",
            "不满意",
            "非常不满意"
        ]
    },

    {
        text: "您认为目前的社会是否稳定？",
        options: [
            "非常稳定",
            "稳定",
            "一般",
            "不稳定"
        ]
    },

    {
        text: "您是否信任政府发布的信息？",
        options: [
            "完全信任",
            "基本信任",
            "不确定",
            "不信任"
        ]
    },

    {
        text: "您是否认为自己是一名合格的公民？",
        options: [
            "是",
            "不确定",
            "否"
        ]
    },

    {
        text: "您是否认为目前的国家政策正在改善您的生活？",
        options: [
            "是",
            "部分是",
            "不知道",
            "否"
        ]
    },

    {
        text: "您是否认识一名对政府持负面意见的人？",
        options: [
            "是",
            "否"
        ]
    },

    {
        text: "您最后一次与该人士交谈是什么时候？",
        options: [
            "今天",
            "昨天",
            "本周",
            "本月",
            "不记得"
        ]
    },

    {
        text: "您是否曾经产生过对政府不满意的想法？",
        options: [
            "从未",
            "偶尔",
            "经常",
            "我不记得"
        ]
    },

    {
        text: "您现在是否独处？",
        options: [
            "是",
            "否"
        ]
    },

    {
        text: "您所在的房间里是否有窗户？",
        options: [
            "有",
            "没有",
            "不确定"
        ]
    },

    {
        text: "您是否听见了声音？",
        options: [
            "是",
            "没有"
        ]
    },

    {
        text: "您现在是否感到不安？",
        options: [
            "是",
            "否"
        ]
    },

    {
        text: "您认为谁正在填写这份调查？",
        options: [
            "我",
            "政府",
            "调查员",
            "不知道"
        ]
    },

    {
        text: "您是否认为自己的回答是自由的？",
        options: [
            "是",
            "否"
        ]
    },

    {
        text: "如果现在允许您停止调查，您会选择停止吗？",
        options: [
            "会",
            "不会",
            "我不知道"
        ]
    },

    {
        text: "您是否愿意让政府保存本次调查的完整记录？",
        options: [
            "愿意",
            "不愿意"
        ]
    },

    {
        text: "您是否相信我们会尊重您的隐私？",
        options: [
            "相信",
            "不相信"
        ]
    },

    {
        text: "您是否觉得有人正在观察您？",
        options: [
            "是",
            "否"
        ]
    },

    {
        text: "您现在还想继续吗？",
        options: [
            "是",
            "否"
        ]
    },

    {
        text: "您满意吗？",
        options: [
            "是"
        ]
    }

];


/* =========================================================
   2. 页面元素
   ========================================================= */

const introScreen =
    document.getElementById("intro-screen");

const surveyScreen =
    document.getElementById("survey-screen");

const blackoutScreen =
    document.getElementById("blackout-screen");

const endingScreen =
    document.getElementById("ending-screen");


const startButton =
    document.getElementById("start-button");

const resetButton =
    document.getElementById("reset-button");

const continueButton =
    document.getElementById("continue-button");


const questionNumber =
    document.getElementById("question-number");

const sessionIdElement =
    document.getElementById("session-id");

const progressBar =
    document.getElementById("progress-bar");


const systemMessage =
    document.getElementById("system-message");

const questionText =
    document.getElementById("question-text");

const previousAnswer =
    document.getElementById("previous-answer");

const optionsContainer =
    document.getElementById("options");

const answerHint =
    document.getElementById("answer-hint");

const footerStatus =
    document.getElementById("footer-status");


const blackoutText =
    document.getElementById("blackout-text");


const jumpscare =
    document.getElementById("jumpscare");

const scareText =
    document.getElementById("scare-text");


/* 摄像头 */

const cameraOverlay =
    document.getElementById("camera-overlay");

const cameraVideo =
    document.getElementById("camera-video");

const cameraStatus =
    document.getElementById("camera-status");

const cameraWarning =
    document.getElementById("camera-warning");

const cameraMessage =
    document.getElementById("camera-message");

const cameraBottom =
    document.getElementById("camera-bottom");


/* 摄像头权限 */

const cameraDenied =
    document.getElementById("camera-denied");

const permissionMessage =
    document.getElementById("permission-message");

const permissionContinue =
    document.getElementById("permission-continue");


/* 错误 */

const errorOverlay =
    document.getElementById("error-overlay");

const errorClose =
    document.getElementById("error-close");


/* Ending */

const endingTitle =
    document.getElementById("ending-title");

const endingText =
    document.getElementById("ending-text");


/* =========================================================
   3. 游戏状态
   ========================================================= */

let currentQuestion = 0;

let answers = [];

let previousGame = null;

let runNumber = 1;

let sessionId = "";

let questionLocked = false;

let waitingTimer = null;

let finalizing = false;


/* 摄像头 */

let cameraStream = null;

let cameraEventRunning = false;


/* =========================================================
   4. 工具函数
   ========================================================= */

function sleep(ms) {

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );

}


function generateSessionId() {

    const random =
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

    return "VEYRA-" + random;
}


function setSystemMessage(text) {

    systemMessage.textContent = text;

}


function showScreen(screen) {

    introScreen.classList.remove("active");

    surveyScreen.classList.remove("active");

    blackoutScreen.classList.remove("active");

    endingScreen.classList.remove("active");


    screen.classList.add("active");

}


function getSavedData() {

    const saved =
        localStorage.getItem(
            "veyraCitizenSurvey"
        );


    if (!saved) {

        return null;

    }


    try {

        return JSON.parse(saved);

    }
    catch (error) {

        console.error(
            "调查记录损坏：",
            error
        );

        return null;
    }

}


/* =========================================================
   5. 初始化
   ========================================================= */

function initialize() {

    previousGame =
        getSavedData();


    if (
        previousGame &&
        previousGame.completed
    ) {

        runNumber =
            (previousGame.runNumber || 1) + 1;


        if (runNumber === 2) {

            startButton.textContent =
                "继续调查";

        }
        else if (runNumber === 3) {

            startButton.textContent =
                "再次进入";

        }
        else {

            startButton.textContent =
                "进入调查";

        }


        document.getElementById(
            "visit-info"
        ).textContent =
            "检测到历史调查记录。";

    }
    else {

        runNumber = 1;

        startButton.textContent =
            "开始调查";

        document.getElementById(
            "visit-info"
        ).textContent =
            "系统状态：正常";
    }


    sessionId =
        generateSessionId();


    sessionIdElement.textContent =
        sessionId;

}


/* =========================================================
   6. 开始调查
   ========================================================= */

function startSurvey() {

    currentQuestion = 0;

    answers = [];

    questionLocked = false;

    finalizing = false;

    cameraEventRunning = false;


    sessionId =
        generateSessionId();


    sessionIdElement.textContent =
        sessionId;


    document.body.classList.remove(
        "third-run"
    );


    if (runNumber >= 3) {

        document.body.classList.add(
            "third-run"
        );
    }


    showScreen(
        surveyScreen
    );


    if (runNumber === 1) {

        setSystemMessage(
            "欢迎，公民。"
        );

        footerStatus.textContent =
            "系统状态：正常";

    }
    else if (runNumber === 2) {

        setSystemMessage(
            "欢迎回来，公民。"
        );

        footerStatus.textContent =
            "系统状态：历史记录已加载";

    }
    else if (runNumber === 3) {

        setSystemMessage(
            "您不需要再次填写。"
        );

        footerStatus.textContent =
            "系统状态：行为模型在线";

    }
    else {

        renderFourthRun();

        return;
    }


    renderQuestion();

}


/* =========================================================
   7. 渲染问题
   ========================================================= */

function renderQuestion() {

    clearWaitingTimer();

    questionLocked = false;


    if (runNumber >= 4) {

        renderFourthRun();

        return;
    }


    const q =
        questions[currentQuestion];


    questionNumber.textContent =
        `问题 ${currentQuestion + 1} / ${questions.length}`;


    questionText.textContent =
        q.text;


    progressBar.style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;


    optionsContainer.innerHTML = "";

    answerHint.textContent = "";

    previousAnswer.textContent = "";


    /* =========================
       历史答案
       ========================= */

    if (
        runNumber >= 2 &&
        previousGame
    ) {

        const oldAnswer =
            previousGame.answers?.[
                currentQuestion
            ];


        if (oldAnswer) {

            previousAnswer.textContent =
                `上次回答：${oldAnswer}`;

        }

    }


    /* =========================
       第三周目 Q9
       ========================= */

    if (
        runNumber === 3 &&
        currentQuestion === 8
    ) {

        renderCameraQuestion();

        return;
    }


    /* =========================
       第三周目 Q13
       ========================= */

    if (
        runNumber === 3 &&
        currentQuestion === 12
    ) {

        specialQuestion13();

        return;
    }


    /* =========================
       普通选项
       ========================= */

    q.options.forEach(
        optionText => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "government-button";


            button.textContent =
                optionText;


            button.addEventListener(
                "click",
                () => {

                    selectAnswer(
                        optionText,
                        button
                    );

                }
            );


            optionsContainer.appendChild(
                button
            );

        }
    );


    /* 第三周目 */

    if (runNumber === 3) {

        const oldAnswer =
            previousGame?.answers?.[
                currentQuestion
            ];


        if (oldAnswer) {

            answerHint.textContent =
                `系统建议：${oldAnswer}`;

        }


        startWaitingTimer();
    }

}


/* =========================================================
   8. 第三周目 Q9：摄像头问题
   ========================================================= */

function renderCameraQuestion() {

    questionLocked = false;


    setSystemMessage(
        "环境确认即将开始。"
    );


    questionText.textContent =
        "您现在是否独处？";


    answerHint.textContent =
        "系统需要确认您的当前环境。";


    optionsContainer.innerHTML = "";


    const yesButton =
        document.createElement(
            "button"
        );


    yesButton.className =
        "government-button";


    yesButton.textContent =
        "是";


    yesButton.addEventListener(
        "click",
        () => {

            startCameraEvent(
                "是"
            );

        }
    );


    optionsContainer.appendChild(
        yesButton
    );


    const noButton =
        document.createElement(
            "button"
        );


    noButton.className =
        "government-button";


    noButton.textContent =
        "否";


    noButton.addEventListener(
        "click",
        () => {

            startCameraEvent(
                "否"
            );

        }
    );


    optionsContainer.appendChild(
        noButton
    );


    startWaitingTimer();

}


/* =========================================================
   9. 真实摄像头事件
   ========================================================= */

async function startCameraEvent(answer) {

    if (cameraEventRunning) {

        return;
    }


    cameraEventRunning = true;

    questionLocked = true;

    clearWaitingTimer();


    answers[currentQuestion] =
        answer;


    optionsContainer.innerHTML = "";


    setSystemMessage(
        "正在确认环境……"
    );


    answerHint.textContent =
        "请允许视觉设备访问。";


    await sleep(900);


    /*
       尝试启动摄像头
    */

    const success =
        await openCamera();


    if (!success) {

        handleCameraDenied();

        return;
    }


    /*
       摄像头打开之后
    */

    await runCameraSequence();


    /*
       关闭摄像头
    */

    stopCamera();


    cameraEventRunning = false;


    setSystemMessage(
        "环境确认完成。"
    );


    await sleep(800);


    nextQuestion();

}


/* =========================================================
   10. 打开摄像头
   ========================================================= */

async function openCamera() {

    /*
       浏览器不支持
    */

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        return false;
    }


    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: "user"
                },

                audio: false

            });


        cameraVideo.srcObject =
            cameraStream;


        cameraStatus.textContent =
            "CONNECTED";


        cameraOverlay.classList.add(
            "show"
        );


        return true;

    }
    catch (error) {

        console.warn(
            "无法访问摄像头：",
            error
        );


        return false;
    }

}


/* =========================================================
   11. 摄像头剧情
   ========================================================= */

async function runCameraSequence() {

    cameraWarning.textContent =
        "正在确认环境……";


    cameraMessage.textContent =
        "视觉设备连接成功。";


    cameraBottom.textContent =
        "调查对象：已确认";


    await sleep(1800);


    cameraMessage.textContent =
        "正在分析环境……";


    await sleep(1600);


    cameraMessage.textContent =
        "人体数量：1";


    await sleep(1800);


    cameraMessage.textContent =
        "环境确认中……";


    await sleep(1400);


    /*
       恐怖点
    */

    cameraMessage.textContent =
        "人体数量：2";


    cameraWarning.textContent =
        "检测结果异常";


    cameraBottom.textContent =
        "调查对象：请保持不动";


    await sleep(1800);


    cameraMessage.textContent =
        "无法确认第二人体的位置。";


    await sleep(1500);


    cameraMessage.textContent =
        "……";


    await sleep(1000);


    cameraMessage.textContent =
        "请不要回头。";


    cameraWarning.textContent =
        "WARNING";


    cameraBottom.textContent =
        "调查对象：正在观察";


    await sleep(2300);


    /*
       最后一段
    */

    cameraMessage.textContent =
        "很好。";


    await sleep(700);


    cameraMessage.textContent =
        "现在我们可以确认您确实独处。";


    await sleep(1300);


    cameraMessage.textContent =
        "我们也确认了另一件事。";


    await sleep(1500);


    /*
       黑一下
    */

    cameraOverlay.style.background =
        "#000";


    cameraMessage.textContent =
        "";


    await sleep(700);


    cameraOverlay.style.background =
        "#050505";


    cameraMessage.textContent =
        "第二个调查对象：已确认";


    await sleep(1600);


    cameraMessage.textContent =
        "……";


    await sleep(800);

}


/* =========================================================
   12. 关闭摄像头
   ========================================================= */

function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                track => track.stop()
            );


        cameraStream = null;
    }


    cameraVideo.srcObject =
        null;


    cameraStatus.textContent =
        "DISCONNECTED";


    cameraOverlay.classList.remove(
        "show"
    );


    cameraOverlay.style.background =
        "#050505";
}


/* =========================================================
   13. 摄像头权限拒绝
   ========================================================= */

function handleCameraDenied() {

    cameraEventRunning = false;

    questionLocked = true;


    stopCamera();


    cameraDenied.classList.add(
        "show"
    );


    permissionMessage.textContent =
        "无法访问视觉设备。";


    /*
       如果玩家拒绝权限，
       也不要让游戏卡死。
    */

    setSystemMessage(
        "视觉验证未完成。"
    );

}


/* =========================================================
   14. 权限失败后继续
   ========================================================= */

permissionContinue.addEventListener(
    "click",
    async () => {

        cameraDenied.classList.remove(
            "show"
        );


        questionLocked = false;


        setSystemMessage(
            "系统已记录验证失败。"
        );


        answerHint.textContent =
            "调查将继续。";


        await sleep(800);


        nextQuestion();

    }
);


/* =========================================================
   15. 第三周目 Q13
   ========================================================= */

function specialQuestion13() {

    questionLocked = true;


    questionNumber.textContent =
        "问题 13 / 20";


    questionText.textContent =
        "您认为谁正在填写这份调查？";


    previousAnswer.textContent =
        "调查对象无需重新识别。";


    answerHint.textContent =
        "身份信息已经存在于系统记录中。";


    optionsContainer.innerHTML = "";


    const button =
        document.createElement(
            "button"
        );


    button.className =
        "government-button auto-answer";


    button.textContent =
        "调查对象：已确认";


    optionsContainer.appendChild(
        button
    );


    setSystemMessage(
        "调查对象无需重新识别。"
    );


    footerStatus.textContent =
        "身份确认：完成";


    setTimeout(
        () => {

            if (
                runNumber === 3 &&
                currentQuestion === 12
            ) {

                setSystemMessage(
                    "很好。我们已经知道是谁了。"
                );


                setTimeout(
                    () => {

                        nextQuestion();

                    },
                    900
                );

            }

        },
        1400
    );

}


/* =========================================================
   16. 选择答案
   ========================================================= */

function selectAnswer(
    answer,
    clickedButton
) {

    if (questionLocked) {

        return;
    }


    questionLocked = true;

    clearWaitingTimer();


    /* =========================
       第一周目 Q7
       ========================= */

    if (
        runNumber === 1 &&
        currentQuestion === 6 &&
        answer === "不记得"
    ) {

        answers[currentQuestion] =
            answer;


        clickedButton.classList.add(
            "selected"
        );


        setSystemMessage(
            "正在记录……"
        );


        setTimeout(
            () => {

                showFirstJumpscare();

            },
            700
        );


        return;
    }


    /* =========================
       第三周目
       ========================= */

    if (runNumber === 3) {

        const oldAnswer =
            previousGame?.answers?.[
                currentQuestion
            ];


        answers[currentQuestion] =
            answer;


        clickedButton.classList.add(
            "selected"
        );


        if (
            oldAnswer &&
            answer !== oldAnswer
        ) {

            setSystemMessage(
                "答案发生变化。"
            );


            answerHint.textContent =
                "您的历史回答并不支持这一选择。";


            setTimeout(
                () => {

                    setSystemMessage(
                        "正在修正回答。"
                    );

                },
                700
            );


            setTimeout(
                () => {

                    forceOldAnswer(
                        oldAnswer
                    );

                },
                1500
            );


            return;
        }


        setSystemMessage(
            "回答已记录。"
        );


        setTimeout(
            () => {

                nextQuestion();

            },
            700
        );


        return;
    }


    /* =========================
       第二周目
       ========================= */

    if (runNumber === 2) {

        const oldAnswer =
            previousGame?.answers?.[
                currentQuestion
            ];


        answers[currentQuestion] =
            answer;


        clickedButton.classList.add(
            "selected"
        );


        if (
            oldAnswer &&
            answer !== oldAnswer
        ) {

            setSystemMessage(
                "这个答案与上一次不同。"
            );


            answerHint.textContent =
                "为什么要改变？";


            setTimeout(
                () => {

                    setSystemMessage(
                        "您的回答已经被比较。"
                    );

                },
                800
            );

        }
        else {

            setSystemMessage(
                "我们记得您的回答。"
            );

        }


        setTimeout(
            () => {

                nextQuestion();

            },
            900
        );


        return;
    }


    /* =========================
       第一周目
       ========================= */

    answers[currentQuestion] =
        answer;


    clickedButton.classList.add(
        "selected"
    );


    setSystemMessage(
        "回答已记录。"
    );


    setTimeout(
        () => {

            nextQuestion();

        },
        600
    );

}


/* =========================================================
   17. 第三周目：强制恢复答案
   ========================================================= */

function forceOldAnswer(
    oldAnswer
) {

    questionLocked = true;


    const buttons =
        optionsContainer.querySelectorAll(
            ".government-button"
        );


    buttons.forEach(
        button => {

            button.disabled = true;


            if (
                button.textContent ===
                oldAnswer
            ) {

                button.classList.add(
                    "selected"
                );


                button.textContent =
                    oldAnswer + "  ✓";
            }

        }
    );


    answers[currentQuestion] =
        oldAnswer;


    setSystemMessage(
        "回答已修正。"
    );


    answerHint.textContent =
        `记录中的答案：${oldAnswer}`;


    setTimeout(
        () => {

            setSystemMessage(
                "这样才是正确的。"
            );

        },
        700
    );


    setTimeout(
        () => {

            nextQuestion();

        },
        1600
    );

}


/* =========================================================
   18. 下一题
   ========================================================= */

function nextQuestion() {

    if (finalizing) {

        return;
    }


    currentQuestion++;


    if (
        currentQuestion >=
        questions.length
    ) {

        finishSurvey();

        return;
    }


    renderQuestion();

}


/* =========================================================
   19. 等待系统
   ========================================================= */

function startWaitingTimer() {

    clearWaitingTimer();


    let seconds = 0;


    waitingTimer =
        setInterval(
            () => {

                seconds++;


                if (seconds === 8) {

                    setSystemMessage(
                        "请作答。"
                    );

                }


                if (seconds === 15) {

                    setSystemMessage(
                        "请回答。"
                    );

                }


                if (seconds === 22) {

                    setSystemMessage(
                        "我们正在等待。"
                    );

                }


                if (seconds === 30) {

                    setSystemMessage(
                        "您在看什么？"
                    );

                }

            },
            1000
        );

}


function clearWaitingTimer() {

    if (waitingTimer) {

        clearInterval(
            waitingTimer
        );

        waitingTimer = null;
    }

}


/* =========================================================
   20. 第一周目惊吓
   ========================================================= */

async function showFirstJumpscare() {

    questionLocked = true;


    setSystemMessage(
        "正在确认您的回答……"
    );


    await sleep(1000);


    jumpscare.classList.add(
        "show"
    );


    scareText.textContent =
        "请不要撒谎。";


    await sleep(1800);


    jumpscare.classList.remove(
        "show"
    );


    await sleep(500);


    nextQuestion();

}


/* =========================================================
   21. 调查结束
   ========================================================= */

function finishSurvey() {

    if (finalizing) {

        return;
    }


    finalizing = true;

    clearWaitingTimer();


    if (runNumber === 1) {

        finishFirstRun();

    }
    else if (runNumber === 2) {

        finishSecondRun();

    }
    else if (runNumber === 3) {

        finishThirdRun();

    }
    else {

        finishFourthRun();

    }

}


/* =========================================================
   22. 第一周目结束
   ========================================================= */

async function finishFirstRun() {

    await showBlackoutSequence([
        "调查完成。",
        "正在生成结果。",
        "请稍候……"
    ]);


    showCameraFake(
        "调查对象：在线"
    );


    await sleep(3000);


    hideCameraFake();


    showEnding(
        "调查完成",
        "感谢您的配合，公民。",
        "下一次调查：即将开始。"
    );


    saveGame();

}


/* =========================================================
   23. 第二周目结束
   ========================================================= */

async function finishSecondRun() {

    await showBlackoutSequence([
        "调查再次完成。",
        "正在比较历史回答。",
        "行为变化已记录。",
        "……",
        "我们记得您。"
    ]);


    showCameraFake(
        "调查对象：再次确认"
    );


    await sleep(3000);


    hideCameraFake();


    jumpscare.classList.add(
        "show"
    );


    scareText.textContent =
        "您又回来了。";


    await sleep(1800);


    jumpscare.classList.remove(
        "show"
    );


    showEnding(
        "调查再次完成",
        "感谢您的再次配合，公民。",
        "下一次调查：明天。"
    );


    saveGame();

}


/* =========================================================
   24. 第三周目结束
   ========================================================= */

async function finishThirdRun() {

    await showBlackoutSequence([
        "调查完成。",
        "正在确认调查对象。",
        "确认完成。",
        "……",
        "您已经被记录。"
    ]);


    jumpscare.classList.add(
        "show"
    );


    scareText.textContent =
        "您又回来了。";


    await sleep(1800);


    jumpscare.classList.remove(
        "show"
    );


    /*
       第三周目结束后再来一次假摄像头
       作为真正摄像头事件后的回响
    */

    showCameraFake(
        "调查对象：已确认"
    );


    await sleep(3000);


    hideCameraFake();


    showEnding(
        "调查不再需要您",
        "我们已经知道您的答案。",
        "下一次调查：不需要等待。"
    );


    saveGame();

}


/* =========================================================
   25. 第四周目
   ========================================================= */

function renderFourthRun() {

    showScreen(
        surveyScreen
    );


    questionNumber.textContent =
        "系统通知";


    sessionIdElement.textContent =
        sessionId;


    progressBar.style.width =
        "100%";


    questionText.textContent =
        "这次不用回答问题。";


    previousAnswer.textContent =
        "我们已经知道答案了。";


    answerHint.textContent =
        "请继续。";


    setSystemMessage(
        "欢迎回来。"
    );


    footerStatus.textContent =
        "系统状态：无需调查";


    optionsContainer.innerHTML = "";


    const button =
        document.createElement(
            "button"
        );


    button.className =
        "government-button";


    button.textContent =
        "继续";


    button.addEventListener(
        "click",
        fourthRunMessage
    );


    optionsContainer.appendChild(
        button
    );

}


/* =========================================================
   26. 第四周目隐藏剧情
   ========================================================= */

async function fourthRunMessage() {

    questionLocked = true;


    optionsContainer.innerHTML = "";


    setSystemMessage(
        "您为什么还在继续？"
    );


    questionText.textContent =
        "没有需要填写的内容。";


    answerHint.textContent =
        "调查已经结束。";


    await sleep(1600);


    showScreen(
        blackoutScreen
    );


    blackoutText.innerHTML =
        "调查对象仍然在线。<br><br>" +
        "您可以关闭此页面。<br><br>" +
        "……<br><br>" +
        "您已经点击过了。";


    await sleep(2500);


    jumpscare.classList.add(
        "show"
    );


    scareText.textContent =
        "我们知道。";


    await sleep(1800);


    jumpscare.classList.remove(
        "show"
    );


    showEnding(
        "调查对象仍然在线",
        "本次调查无需回答。",
        "感谢您的继续配合。"
    );


    saveGame();

}


/* =========================================================
   27. 黑屏
   ========================================================= */

async function showBlackoutSequence(
    messages
) {

    showScreen(
        blackoutScreen
    );


    for (
        const message of messages
    ) {

        blackoutText.textContent =
            message;


        await sleep(1100);
    }

}


/* =========================================================
   28. 假摄像头
   ========================================================= */

function showCameraFake(
    statusText
) {

    /*
       注意：
       这里是纯游戏视觉效果，
       不会访问玩家摄像头。
    */

    cameraOverlay.classList.add(
        "show"
    );


    cameraStatus.textContent =
        "SIMULATED";


    cameraBottom.textContent =
        statusText;


    cameraWarning.textContent =
        "环境确认中……";


    cameraMessage.textContent =
        "视觉设备：模拟连接";
}


function hideCameraFake() {

    cameraOverlay.classList.remove(
        "show"
    );


    cameraStatus.textContent =
        "DISCONNECTED";
}


/* =========================================================
   29. Ending
   ========================================================= */

function showEnding(
    title,
    text,
    smallText
) {

    showScreen(
        endingScreen
    );


    endingTitle.textContent =
        title;


    endingText.textContent =
        text;


    const small =
        endingScreen.querySelector(
            ".ending-small"
        );


    if (small) {

        small.textContent =
            smallText;
    }

}


/* =========================================================
   30. 保存游戏
   ========================================================= */

function saveGame() {

    const gameData = {

        completed: true,

        runNumber: runNumber,

        sessionId: sessionId,

        answers: answers,

        timestamp:
            new Date().toISOString()

    };


    localStorage.setItem(
        "veyraCitizenSurvey",
        JSON.stringify(gameData)
    );

}


/* =========================================================
   31. 返回首页
   ========================================================= */

continueButton.addEventListener(
    "click",
    () => {

        stopCamera();


        showScreen(
            introScreen
        );


        finalizing = false;


        previousGame =
            getSavedData();


        if (previousGame) {

            runNumber =
                previousGame.runNumber + 1;
        }


        if (runNumber === 2) {

            startButton.textContent =
                "继续调查";

        }
        else if (runNumber === 3) {

            startButton.textContent =
                "再次进入";

        }
        else {

            startButton.textContent =
                "进入调查";

        }


        document.getElementById(
            "visit-info"
        ).textContent =
            "检测到历史调查记录。";

    }
);


/* =========================================================
   32. 开始按钮
   ========================================================= */

startButton.addEventListener(
    "click",
    startSurvey
);


/* =========================================================
   33. 重置按钮
   ========================================================= */

if (resetButton) {

    resetButton.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "确定要清除所有调查记录吗？\n\n" +
                    "这将使调查从第一周目重新开始。"
                );


            if (!confirmed) {

                return;
            }


            /*
               清除游戏记录
            */

            localStorage.removeItem(
                "veyraCitizenSurvey"
            );


            /*
               同时确保摄像头关闭
            */

            stopCamera();


            /*
               刷新
            */

            location.reload();

        }
    );

}


/* =========================================================
   34. 错误弹窗
   ========================================================= */

if (errorClose) {

    errorClose.addEventListener(
        "click",
        () => {

            errorOverlay.classList.remove(
                "show"
            );

        }
    );

}


/* =========================================================
   35. 第三周目：离开页面
   ========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden &&
            runNumber >= 3 &&
            !finalizing
        ) {

            setTimeout(
                () => {

                    if (
                        !document.hidden &&
                        surveyScreen.classList.contains(
                            "active"
                        )
                    ) {

                        setSystemMessage(
                            "您回来了。"
                        );

                    }

                },
                1000
            );

        }

    }
);


/* =========================================================
   36. 第三周目随机系统消息
   ========================================================= */

setInterval(
    () => {

        if (
            runNumber >= 3 &&
            surveyScreen.classList.contains(
                "active"
            ) &&
            !questionLocked &&
            !finalizing &&
            !cameraEventRunning
        ) {

            const messages = [

                "系统正在等待您的回答。",

                "您的行为已被记录。",

                "不要改变答案。",

                "我们正在观察。",

                "请继续。",

                "您知道答案。",

                "回答没有必要重复。",

                "系统运行正常。"

            ];


            const randomMessage =
                messages[
                    Math.floor(
                        Math.random() *
                        messages.length
                    )
                ];


            setSystemMessage(
                randomMessage
            );

        }

    },
    12000
);


/* =========================================================
   37. 页面关闭前确保关闭摄像头
   ========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        stopCamera();

    }
);


/* =========================================================
   38. 启动
   ========================================================= */

initialize();
