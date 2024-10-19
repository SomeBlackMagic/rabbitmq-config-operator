export type Condition = {
    type: string;
    status: string;
    lastUpdatedTime: string;
    reason: string;
    message: string;
};

export function updateCondition(conditions: Condition[], typeToFind: string, newCondition: Condition): Condition[] {
    return conditions.map((condition) =>
        condition.type === typeToFind ? newCondition : condition
    );
}