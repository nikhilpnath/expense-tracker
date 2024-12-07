import { prisma } from '~/utils/prisma.server'

type ExpenseDataType = {
    title: string,
    amount: string;
    date: string;

}

export async function addExpense(expenseData: ExpenseDataType, userId: string) {
    await prisma.expense.create({
        data: {
            title: expenseData.title,
            amount: +expenseData.amount,
            date: new Date(expenseData.date),
            User: { connect: { id: userId } }
        }
    }).catch(() => {
        throw new Error("Failed to add expense")

    })

}

export async function getExpenses(userId: string) {
    
    if (!userId || typeof userId !== 'string'){
        throw new Error("Failed to get expense")

    }
    return await prisma.expense.findMany({
        where: { userId },
        orderBy: { date: "desc" }
    }).catch(() => {
        throw new Error("Failed to get expense")

    })
}


export async function deleteExpense(id: string) {
    await prisma.expense.delete({ where: { id } }).catch(() => {
        throw new Error("Failed to delete expense")
    })
}

export async function updateExpense(id: string, expenseData: ExpenseDataType) {
    await prisma.expense.update(
        {
            where: { id },
            data: {
                title: expenseData.title,
                amount: +expenseData.amount,
                date: new Date(expenseData.date)
            }
        }).catch(() => {
            throw new Error("Failed to update expense")
        })

}