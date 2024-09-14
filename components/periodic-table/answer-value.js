import React from 'react';
import { getContrastColor } from '../../lib/periodic-table';
import styles from './answer-value.module.css';

const AnswerValue = ({ text, backgroundColor }) => {

    return (
        <div
            className={styles.selectedElementAnswer}
            style={{
                backgroundColor: backgroundColor,
                color: backgroundColor ? getContrastColor(backgroundColor) : 'inherit'
            }}
        >
            {text || 'Value'}
        </div>
    );
};

export default AnswerValue;
