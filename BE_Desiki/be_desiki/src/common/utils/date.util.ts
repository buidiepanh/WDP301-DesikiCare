import * as moment from 'moment-timezone';
import { AppConfig } from 'src/config/app.config';

/**
 * Lấy Date object hiện tại theo timezone từ AppConfig
 * @returns Date object với thời gian hiện tại theo timezone đã cấu hình
 */
export function getCurrentDateWithTimezone(): Date {
    const timezone = AppConfig().appConfig.TZ || 'Asia/Ho_Chi_Minh';
    return moment().tz(timezone).toDate();
}

/**
 * Lấy Date object hiện tại theo timezone từ AppConfig với format cụ thể
 * @returns Date object được tạo từ ISO string với offset
 */
export function getCurrentDateWithTimezoneFormatted(): Date {
    const timezone = AppConfig().appConfig.TZ || 'Asia/Ho_Chi_Minh';
    return new Date(moment().tz(timezone).format());
}

/**
 * Thêm khoảng thời gian vào current date theo timezone
 * @param amount - Số lượng thời gian cần thêm
 * @param unit - Đơn vị thời gian ('days', 'months', 'years', 'hours', 'minutes', etc.)
 * @returns Date object sau khi thêm thời gian
 */
export function addTimeToCurrentDate(amount: number, unit: moment.unitOfTime.DurationConstructor): Date {
    const timezone = AppConfig().appConfig.TZ || 'Asia/Ho_Chi_Minh';
    return moment().tz(timezone).add(amount, unit).toDate();
}

/**
 * So sánh xem một date có phải là trong tương lai so với current time không
 * @param date - Date cần so sánh
 * @returns true nếu date > current time
 */
export function isFutureDate(date: Date): boolean {
    const currentTime = getCurrentDateWithTimezone();
    return new Date(date) > currentTime;
}

/**
 * So sánh xem một date có gần hết hạn trong khoảng thời gian nhất định không
 * @param date - Date cần kiểm tra
 * @param amount - Số lượng thời gian
 * @param unit - Đơn vị thời gian
 * @returns true nếu date nằm trong khoảng từ hiện tại đến amount unit
 */
export function isNearExpiry(date: Date, amount: number, unit: moment.unitOfTime.DurationConstructor): boolean {
    const currentTime = getCurrentDateWithTimezone();
    const thresholdTime = addTimeToCurrentDate(amount, unit);
    const targetDate = new Date(date);
    
    return targetDate > currentTime && targetDate <= thresholdTime;
}

/**
 * Lấy Date object với timezone cụ thể
 * @param timezone - Timezone string (ví dụ: 'Asia/Ho_Chi_Minh', 'UTC')
 * @returns Date object với timezone đã chỉ định
 */
export function getCurrentDateWithSpecificTimezone(timezone: string): Date {
    return moment().tz(timezone).toDate();
}