import dayjs from 'dayjs';

const formatDate = (date: string | Date) => {
    return dayjs(date).format('YYYY-MM-DD');
};

export default formatDate;