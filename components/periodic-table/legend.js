import styles from './legend.module.css';
import AnswerValue from './answer-value';
import { getElementColor } from '../../lib/periodic-table';

export default function Legend({ categories, rangeMin, rangeMax }) {

    const values = [rangeMin?.value, (rangeMin?.value + rangeMax?.value) / 2, rangeMax?.value]
        .filter(value => value !== undefined && !isNaN(value));
    return (<div className={styles.container}>
        <h2>Legend</h2>
        <div className={styles.legend}>
            {categories && categories.map((category, index) => (
                <AnswerValue
                    text={category.name}
                    backgroundColor={getElementColor(categories, rangeMin?.hexColour, rangeMax?.hexColour, rangeMax?.value, category.name)}
                />
            ))}
            {values.length > 0 && (
                values.map((value, index) => (
                    <AnswerValue
                        text={`${value}`}
                        backgroundColor={getElementColor(categories, rangeMin?.hexColour, rangeMax?.hexColour, rangeMax?.value, value)}
                    />
                ))
            )}
        </div>
    </div>)
}
