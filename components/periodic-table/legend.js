import styles from './legend.module.css';
import AnswerValue from './answer-value';
import { getElementColor } from '../../lib/periodic-table';

export default function Legend({ categories, rangeMin, rangeMax }) {

    return (<div className={styles.container}>
        <h2>Legend</h2>
        <div className={styles.legend}>
            {categories && categories.map((category, index) => (
                <AnswerValue
                    text={category.name}
                    backgroundColor={getElementColor(categories, rangeMin?.hexColour, rangeMax?.hexColour, rangeMax?.value, category.name)}
                />
            ))}
        </div>
    </div>)
}
