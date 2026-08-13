import React from 'react'
import styles from '../../assets/styles/ManagerTimelineItem.module.css'
import { MANAGER_TIMELINE_TEXT } from '../../util/timeline';

function ManagerTimelineItem({ item, isFinished }) {
    const config = MANAGER_TIMELINE_TEXT[item.status];
    const state = isFinished && item.status === 'COMPLETED' ? 'done' : item.state

    return (
        <div className={`${styles.item} ${styles[state]}`}>
            <div className={`${styles.icon} ${styles[`${state}Border`]}`}>
                <i className={config.icon}></i>
            </div>

            <p className={styles[`${state}Label`]}>
                {config[state]}
            </p>
        </div>
    );
}

export default ManagerTimelineItem
