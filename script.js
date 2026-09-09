/* =========================================
   CITIZEN SATISFACTION SURVEY
   Main game logic
========================================= */


// =========================================
// DOM
// =========================================

const introScreen = document.getElementById("intro-screen");
const surveyScreen = document.getElementById("survey-screen");
const blackoutScreen = document.getElementById("blackout-screen");
const endingScreen = document.getElementById("ending-screen");

const startButton = document.getElementById("start-button");
const continueButton = document.getElementById("continue-button");

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options");

const questionNumber = document.getElementById("question-number");
const progressBar = document.getElementById("progress-bar");

const systemMessage = document.getElementById("system-message");

const jumpscare = document.getElementById("jumpscare");
const jumpscareText = document.getElementById("jumpscare-text");

const cameraOverlay = document.getElementById("camera-overlay");

const blackoutText = document.getElementById("blackout-text");

const finalSession = document.getElementById("final-session");
const sessionIdElement = document.getElementById("session-id");


// =========================================
// GAME DATA
// =========================================

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
        ],
        abnormal: true
    },

    {
        text: "您最后一次与该人士交谈是什么时候？",
        options: [
            "今天",
            "昨天",
            "本周",
            "本月",
            "不记得"
        ],
        abnormal: true
    },

    {
        text: "您是否曾经产生过对政府不满意的想法？",
        options: [
            "从未",
            "偶尔",
            "经常",
            "我不记得"
        ],
        abnormal: true
    },

    {
        text: "您现在是否独处？",
        options: [
            "是",
            "否"
        ],
        abnormal: true
    },

    {
        text: "您所在的房间里是否有窗户？",
        options: [
            "有",
            "没有",
            "不确定"
        ],
        abnormal: true
    },

    {
        text: "您是否听见了声音？",
        options: [
            "是",
            "没有"
        ],
        abnormal: true
    },

    {
        text: "您现在是否感到不安？",
        options: [
            "是",
            "否"
        ],
        abnormal: true
    },

    {
        text: "您认为谁正在填写这份调查？",
        options: [
            "我",
            "政府",
            "调查员",
            "不知道"
        ],
        abnormal: true
    },

    {
        text: "您是否认为自己的回答是自由的？",
        options: [
            "是",
            "否"
        ],
        abnormal: true
    },

    {
        text: "如果现在允许您停止调查，您会选择停止吗？",
        options: [
            "会",
            "不会",
            "我不知道"
        ],
        abnormal: true
    },

    {
        text: "您是否愿意让政府保存本次调查的完整记录？",
        options: [
            "愿意",
            "不愿意"
        ],
        abnormal: true
    },

    {
        text: "您是否相信我们会尊重您的隐私？",
        options: [
            "相信",
            "不相信"
        ],
        abnormal: true
    },

    {
        text: "您是否觉得有人正在观察您？",
        options: [
            "是",
            "否"
        ],
        abnormal: true
    },

    {
        text: "您现在还想继续吗？",
        options: [
            "是",
            "否"
        ],
        abnormal: true
    },

    {
        text: "您满意吗？",
        options: [
            "是"
        ],
        final: true
    }

];


// =========================================
// GAME STATE
// =========================================

let currentQuestion = 0;

let answers = [];

let threat = 0;

let honesty = 100;

let hasPlayed = false;

let sessionId = "0000001";


// =========================================
// LOCAL STORAGE
// =========================================

const savedGame = localStorage.getItem(
    "veyraCitizenSurvey"
);


if (savedGame) {

    try {

        const data = JSON.parse(savedGame);

        if (data.completed) {
            hasPlayed = true;
        }

    } catch (error) {

        console.log("旧记录无法读取。");

    }
}


// =========================================
// SESSION
// =========================================

function generateSessionId() {

    const random =
        Math.floor(
            1000000 +
            Math.random() * 8999999
        );

    sessionId = String(random);

    sessionIdElement.textContent = sessionId;
    finalSession.textContent = sessionId;
}


// =========================================
// SCREEN MANAGEMENT
// =========================================

function showScreen(screen) {

    [
        introScreen,
        surveyScreen,
        blackoutScreen,
        endingScreen
    ].forEach(element => {

        element.classList.remove("active");

    });

    screen.classList.add("active");
}


// =========================================
// START GAME
// =========================================

startButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    currentQuestion = 0;

    answers = [];

    threat = 0;

    honesty = 100;

    generateSessionId();

    showScreen(surveyScreen);

    loadQuestion();
}


// =========================================
// LOAD QUESTION
// =========================================

function loadQuestion() {

    const question =
        questions[currentQuestion];


    questionText.textContent =
        question.text;


    questionNumber.textContent =
        `第 ${String(currentQuestion + 1).padStart(2, "0")} / ${questions.length} 题`;


    const progress =
        ((currentQuestion) /
        questions.length) * 100;


    progressBar.style.width =
        `${progress}%`;


    optionsContainer.innerHTML = "";


    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement("button");

            button.className =
                "option";

            button.innerHTML = `
                <span class="letter">
                    ${String.fromCharCode(65 + index)}
                </span>
                ${option}
            `;


            button.addEventListener(
                "click",
                () => selectAnswer(option)
            );


            optionsContainer.appendChild(
                button
            );

        }
    );


    systemMessage.classList.remove(
        "visible"
    );


    // 异常问题开始出现时
    if (question.abnormal) {

        document.body.classList.add(
            "glitch"
        );

        setTimeout(() => {

            document.body.classList.remove(
                "glitch"
            );

        }, 250);

    }

}


// =========================================
// ANSWER
// =========================================

function selectAnswer(answer) {

    const question =
        questions[currentQuestion];


    answers.push({
        question:
            question.text,

        answer:
            answer
    });


    // ================================
    // NORMAL QUESTIONS
    // ================================

    if (!question.abnormal &&
        !question.final) {

        currentQuestion++;

        setTimeout(
            loadQuestion,
            180
        );

        return;
    }


    // ================================
    // ABNORMAL QUESTIONS
    // ================================

    if (question.abnormal) {

        handleAbnormalAnswer(
            answer
        );

        return;
    }


    // ================================
    // FINAL
    // ================================

    if (question.final) {

        finalSequence();

    }

}


// =========================================
// ABNORMAL ANSWERS
// =========================================

function handleAbnormalAnswer(answer) {

    const index =
        currentQuestion;


    // Q6
    if (index === 5) {

        showSystemMessage(
            "记录。"
        );

        threat += 8;

    }


    // Q7
    if (index === 6) {

        if (answer === "不记得") {

            honesty -= 15;

            showSystemMessage(
                "请不要撒谎。"
            );

            setTimeout(
                firstJumpscare,
                700
            );

            return;

        }

        threat += 5;

    }


    // Q8
    if (index === 7) {

        threat += 7;

    }


    // Q9
    if (index === 8) {

        threat += 5;

    }


    // Q10
    if (index === 9) {

        threat += 3;

    }


    // Q11
    if (index === 10) {

        if (answer === "是") {

            threat += 10;

        }

    }


    // Q12
    if (index === 11) {

        if (answer === "否") {

            honesty -= 20;

            showSystemMessage(
                "答案与生理指标不符。"
            );

        } else {

            showSystemMessage(
                "已记录。"
            );

        }

    }


    // Q13
    if (index === 12) {

        threat += 12;

        showSystemMessage(
            "错误。"
        );

        setTimeout(
            strangeIdentification,
            900
        );

        return;

    }


    // Q14+
    if (index >= 13) {

        threat += 5;

        if (answer === "不相信" ||
            answer === "否" ||
            answer === "会") {

            honesty -= 10;

        }

    }


    currentQuestion++;


    setTimeout(
        loadQuestion,
        500
    );

}


// =========================================
// SYSTEM MESSAGE
// =========================================

function showSystemMessage(text) {

    systemMessage.textContent =
        text;

    systemMessage.classList.add(
        "visible"
    );

}


// =========================================
// FIRST JUMPSCARE
// =========================================

function firstJumpscare() {

    jumpscareText.textContent =
        "请不要撒谎。";


    jumpscare.classList.add(
        "active"
    );


    document.body.classList.add(
        "glitch"
    );


    setTimeout(() => {

        jumpscare.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "glitch"
        );


        currentQuestion++;

        loadQuestion();

    }, 1100);

}


// =========================================
// IDENTIFICATION EVENT
// =========================================

function strangeIdentification() {

    showSystemMessage(
        "正在重新识别调查对象……"
    );


    setTimeout(() => {

        showError(
            `
            调查员：未知<br><br>

            调查对象：未知<br><br>

            设备：已识别<br><br>

            位置：已识别<br><br>

            身份：已识别<br><br>

            <strong>
            姓名：您
            </strong>
            `
        );

    }, 500);


    setTimeout(() => {

        currentQuestion++;

        loadQuestion();

    }, 2400);

}


// =========================================
// ERROR BOX
// =========================================

function showError(text) {

    const overlay =
        document.getElementById(
            "error-overlay"
        );

    const textElement =
        document.getElementById(
            "error-text"
        );


    textElement.innerHTML =
        text;


    overlay.classList.add(
        "active"
    );


    setTimeout(() => {

        overlay.classList.remove(
            "active"
        );

    }, 1700);

}


// =========================================
// FINAL SEQUENCE
// =========================================

function finalSequence() {

    progressBar.style.width =
        "100%";


    showScreen(
        blackoutScreen
    );


    blackoutText.textContent =
        "";


    setTimeout(() => {

        blackoutText.textContent =
            "调查已完成。";

        blackoutText.classList.add(
            "visible"
        );

    }, 1000);


    setTimeout(() => {

        blackoutText.classList.remove(
            "visible"
        );


        setTimeout(
            finalJumpscare,
            500
        );

    }, 2400);

}


// =========================================
// FINAL JUMPSCARE
// =========================================

function finalJumpscare() {

    jumpscareText.textContent =
        "您说谎了。";


    jumpscare.classList.add(
        "active"
    );


    document.body.classList.add(
        "glitch"
    );


    setTimeout(() => {

        jumpscare.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "glitch"
        );


        cameraSequence();

    }, 1300);

}


// =========================================
// CAMERA SEQUENCE
// =========================================

function cameraSequence() {

    cameraOverlay.classList.add(
        "active"
    );


    // 摄像头画面慢慢靠近
    setTimeout(() => {

        const person =
            document.querySelector(
                ".camera-person"
            );

        person.style.transform =
            "scale(1.5)";

    }, 1800);


    setTimeout(() => {

        cameraOverlay.classList.remove(
            "active"
        );


        finishGame();

    }, 5200);

}


// =========================================
// FINISH GAME
// =========================================

function finishGame() {

    localStorage.setItem(
        "veyraCitizenSurvey",
        JSON.stringify({

            completed: true,

            sessionId: sessionId,

            threat: threat,

            honesty: honesty,

            answers: answers,

            completedAt:
                new Date().toISOString()

        })
    );


    showScreen(
        endingScreen
    );


    finalSession.textContent =
        sessionId;

}


// =========================================
// CONTINUE / SECOND PLAYTHROUGH
// =========================================

continueButton.addEventListener(
    "click",
    () => {

        // 第二次游戏不会完全一样
        localStorage.setItem(
            "veyraPreviousSession",
            sessionId
        );


        // 故意产生新的 SESSION
        generateSessionId();


        currentQuestion = 0;

        answers = [];

        threat = 0;

        honesty = 100;


        showScreen(
            surveyScreen
        );


        loadQuestion();


        // 第二周目特殊提示
        setTimeout(() => {

            showSystemMessage(
                "我们记得您的上一次回答。"
            );

        }, 1200);

    }
);


// =========================================
// 禁止双击选中文字
// =========================================

document.addEventListener(
    "dblclick",
    event => {

        event.preventDefault();

    }
);


// =========================================
// 防止玩家快速点击造成状态错乱
// =========================================

let lastClick = 0;


document.addEventListener(
    "click",
    event => {

        const now =
            Date.now();

        if (now - lastClick < 60) {

            event.stopPropagation();

        }

        lastClick = now;

    },
    true
);


// =========================================
// CONSOLE EASTER EGG
// =========================================

console.log(
`
╔══════════════════════════════════════╗
║   REPUBLIC OF VEYRA                  ║
║   CITIZEN SERVICE SYSTEM             ║
╠══════════════════════════════════════╣
║                                      ║
║   SYSTEM STATUS: NORMAL              ║
║                                      ║
║   Citizen monitoring: ACTIVE         ║
║                                      ║
╚══════════════════════════════════════╝
`
);
