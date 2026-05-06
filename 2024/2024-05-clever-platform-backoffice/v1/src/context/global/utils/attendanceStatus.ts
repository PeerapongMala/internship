export type AttendanceStatus = 0 | 1 | 2 | 3 | 4;

interface AttendanceStatusConfig {
  text: string;
  className: string;
  color: string;
}

const attendanceStatusMap: Record<AttendanceStatus, AttendanceStatusConfig> = {
  0: {
    text: '',
    className: 'text-black',
    color: 'gray',
  },
  1: {
    text: 'ม',
    className: 'text-black',
    color: 'green',
  },
  2: {
    text: 'ป',
    className: 'text-red-500',
    color: 'red',
  },
  3: {
    text: 'ล',
    className: 'text-red-500',
    color: 'red',
  },
  4: {
    text: 'ข',
    className: 'text-red-500',
    color: 'red',
  },
};
/**
 * Converts attendance status code to Thai display text
 * @param status - Attendance status code (0-4)
 * @returns Corresponding Thai text ('มา', 'ป', 'ล', 'ข') or empty string for unknown status
 * @example
 * getAttendanceStatusText(1); // Returns 'มา'
 * getAttendanceStatusText(3); // Returns 'ล'
 */
export const getAttendanceStatusText = (status: number): string => {
  return attendanceStatusMap[status as AttendanceStatus]?.text || '';
};

/**
 * Gets Tailwind CSS classes for styling based on attendance status
 * @param status - Attendance status code (0-4)
 * @returns Tailwind classes for appropriate status styling
 * @example
 * getAttendanceStatusClass(1); // Returns 'bg-green-100 text-green-800'
 * getAttendanceStatusClass(4); // Returns 'bg-red-100 text-red-800'
 */
export const getAttendanceStatusClass = (status: number): string => {
  return attendanceStatusMap[status as AttendanceStatus]?.className || 'text-gray-400';
};

/**
 * Gets base color name for attendance status
 * @param status - Attendance status code (0-4)
 * @returns Color name ('green', 'yellow', 'blue', 'red', 'gray')
 * @example
 * getAttendanceStatusColor(2); // Returns 'yellow'
 */
export const getAttendanceStatusColor = (status: number): string => {
  return attendanceStatusMap[status as AttendanceStatus]?.color || 'gray';
};

/**
 * Gets complete configuration object for attendance status
 * @param status - Attendance status code (0-4)
 * @returns Object containing {text, className, color} properties
 * @example
 * getAttendanceStatusConfig(3);
 * // Returns {text: 'ล', className: 'bg-blue-100 text-blue-800', color: 'blue'}
 */
export const getAttendanceStatusConfig = (status: number): AttendanceStatusConfig => {
  return attendanceStatusMap[status as AttendanceStatus] || attendanceStatusMap[0];
};
