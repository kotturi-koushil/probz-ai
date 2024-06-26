export const transformData = (data, timeframe) => {
    if (timeframe === 'daily') {
        return data;
    } else if (timeframe === 'weekly') {
        return groupByWeek(data);
    } else if (timeframe === 'monthly') {
        return groupByMonth(data);
    }
};

const groupByWeek = (data) => {
    // Group data by week
    const result = [];
    data.reduce((acc, item) => {
        const week = getWeek(item.timestamp);
        if (!acc[week]) {
            acc[week] = { timestamp: week, value: 0, count: 0 };
            result.push(acc[week]);
        }
        acc[week].value += item.value;
        acc[week].count += 1;
        return acc;
    }, {});

    result.forEach(item => item.value = item.value / item.count);
    return result;
};

const groupByMonth = (data) => {
    // Group data by month
    const result = [];
    data.reduce((acc, item) => {
        const month = item.timestamp.slice(0, 7);
        if (!acc[month]) {
            acc[month] = { timestamp: month, value: 0, count: 0 };
            result.push(acc[month]);
        }
        acc[month].value += item.value;
        acc[month].count += 1;
        return acc;
    }, {});

    result.forEach(item => item.value = item.value / item.count);
    return result;
};

const getWeek = (dateString) => {
    const date = new Date(dateString);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return `Week ${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)}`;
};
