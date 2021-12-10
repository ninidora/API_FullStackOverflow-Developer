import "../setup";
import connection from "../database";

export async function newQuestion(question: string, student: string, userClass: string, tags: string):Promise<number> {
    let classId;

    const classAlreadyRegistered = await connection.query(`
        SELECT *
        FROM classes
        WHERE name=$1
    `, [userClass]);

    if (classAlreadyRegistered.rowCount === 0){
        const result = await connection.query(`
            INSERT INTO classes
            (name)
            VALUES ($1)
            RETURNING id
        `, [userClass]);
        classId = result.rows[0].id;

    } else {
        const result = await connection.query(`
            SELECT id
            FROM classes
            WHERE name=$1
        `, [userClass]);
        classId = result.rows[0].id;
    }

    const questionId = await connection.query(`
        INSERT INTO questions
        (question, "classId", student, tags, "submitAt")
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id
    `, [question, classId, student, tags]);
    return questionId.rows[0].id;
}

export async function getUnansweredQuestions() {
    const result = await connection.query(`
        SELECT questions.id, questions.question, questions.student, questions."submitAt",
        classes.name AS class
        FROM questions
        JOIN classes
        ON questions."classId"=classes.id
        WHERE answered=false
    `);
    return result.rows;
}
