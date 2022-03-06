import styles from "./score.module.css"

export default function CopyFen({ fen }) {
    return <div>
        <a className={styles.chessDotComLink} target="_blank" rel="noopener noreferrer" href={`https://www.chess.com/play/computer?fen=${fen}`}>Open in Chess.com</a>
        <input type="text" id="fen" name="fen" readOnly value={fen} className={styles.fenBox} />
        <button className={`btn btn-info btn-sm ${styles.copyFen}`} onClick={() => { navigator.clipboard.writeText(fen) }}>Copy FEN</button>
    </div>
}