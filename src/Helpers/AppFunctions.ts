

// AppFunctions.ts
export const AppFunctions = {
    /**
     * Format a JavaScript Date object to a string
     * @param date - Date object
     * @param format - Format string (e.g., 'DD-MM-YYYY', 'YYYY/MM/DD', etc.)
     * @returns Formatted date string
     */
    //   formatDate: (date: Date | string | null, format: string = 'DD-MM-YYYY'): string => {
    //     if (!date) return '';

    //     const d = typeof date === 'string' ? new Date(date) : date;

    //     const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

    //     const day = pad(d.getDate());
    //     const month = pad(d.getMonth() + 1);
    //     const year = d.getFullYear();
    //     const hours = pad(d.getHours());
    //     const minutes = pad(d.getMinutes());
    //     const seconds = pad(d.getSeconds());

    //     return format
    //       .replace('DD', day)
    //       .replace('MM', month)
    //       .replace('YYYY', `${year}`)
    //       .replace('HH', hours)
    //       .replace('mm', minutes)
    //       .replace('ss', seconds);
    //   },


    //   /**
    //    * Parse a date string into a Date object safely
    //    * @param dateStr - string to parse
    //    * @returns Date or null
    //    */
    //   parseDate: (dateStr: string): Date | null => {
    //     const parsed = new Date(dateStr);
    //     return isNaN(parsed.getTime()) ? null : parsed;
    //   },

    formatDate: (dateStr: any, withTime = false) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            ...(withTime && { hour: '2-digit', minute: '2-digit', hour12: true })
        };
        return date.toLocaleString('en-US', options);
    }
};

