"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorQuizPipeline = void 0;
exports.ContractorQuizPipeline = [
    {
        $lookup: {
            from: "contractor_quizzes",
            localField: "_id",
            foreignField: "contractor",
            as: "quizzes"
        }
    },
    {
        $addFields: {
            latestQuiz: { $arrayElemAt: [{ $filter: { input: "$quizzes", as: "quiz", cond: {} } }, 0] }
        }
    },
    {
        $lookup: {
            from: "questions",
            localField: "latestQuiz.quiz",
            foreignField: "quiz",
            as: "questions"
        }
    },
    {
        $addFields: {
            "quiz.totalQuestions": 10, // Or use { $size: "$questions" } for dynamic count
            "quiz.totalCorrect": {
                $cond: {
                    if: { $isArray: "$latestQuiz.response" },
                    then: {
                        $size: {
                            $filter: {
                                input: "$latestQuiz.response",
                                as: "response",
                                cond: { $eq: ["$$response.correct", true] }
                            }
                        }
                    },
                    else: 0
                }
            },
            "quiz.totalWrong": {
                $cond: {
                    if: { $isArray: "$latestQuiz.response" },
                    then: {
                        $subtract: [
                            10, // Replace with { $size: "$questions" } if dynamic
                            {
                                $size: {
                                    $filter: {
                                        input: "$latestQuiz.response",
                                        as: "response",
                                        cond: { $eq: ["$$response.correct", true] }
                                    }
                                }
                            }
                        ]
                    },
                    else: 10 // Replace with { $size: "$questions" } if dynamic
                }
            },
            "quiz.totalAnswered": {
                $cond: {
                    if: { $isArray: "$latestQuiz.response" },
                    then: { $size: "$latestQuiz.response" },
                    else: 0
                }
            },
            "quiz.percentageCorrect": {
                $cond: {
                    if: { $isArray: "$latestQuiz.response" },
                    then: {
                        $multiply: [
                            {
                                $divide: [
                                    {
                                        $size: {
                                            $filter: {
                                                input: "$latestQuiz.response",
                                                as: "response",
                                                cond: { $eq: ["$$response.correct", true] }
                                            }
                                        },
                                        // 10 // Replace with { $size: "$questions" } if dynamic
                                    }, { $size: "$questions" }
                                ]
                            },
                            100
                        ]
                    },
                    else: 0
                }
            },
            "quiz.passed": {
                $cond: {
                    if: { $isArray: "$latestQuiz.response" },
                    then: {
                        $gte: [
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            {
                                                $size: {
                                                    $filter: {
                                                        input: "$latestQuiz.response",
                                                        as: "response",
                                                        cond: { $eq: ["$$response.correct", true] }
                                                    }
                                                },
                                                // 10 // Replace with { $size: "$questions" } if dynamic
                                            }, { $size: "$questions" }
                                        ]
                                    },
                                    100
                                ]
                            },
                            70
                        ]
                    },
                    else: false
                }
            }
        }
    },
    {
        $project: {
            quizzes: 0,
            questions: 0,
            latestQuiz: 0
        }
    }
];
