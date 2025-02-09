export { replayEvents };


const replayEvents = (core, events, options = {}) => {
    if (!events.length) {
        return;
    }

    const { sameSpeed, pauseEmits = true } = options;
    if (pauseEmits) {
        core.paused = true;
    }

    if (!sameSpeed) {
        events.forEach(event => {
            core.moduleEmitDirect(event.name, event.data);
        });
        core.paused = false;
        return;
    }

    const { length } = events;
    let i = 0;
    const playNext = () => {
        const event = events[i];
        core.moduleEmitDirect(event.name, event.data);
        i += 1;
        if (i < length) {
            const timeDifference = events[i].time - event.time;
            setTimeout(playNext, timeDifference);
            return;
        }
        core.paused = false;
    };
    playNext();
};
