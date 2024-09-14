import styles from './legend.module.css';

export const Legend = ({ }) => {



    return (<div className={styles.legendContainer + " " + styles.section}>
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