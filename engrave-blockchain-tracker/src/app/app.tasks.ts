import startTrackingBlockchain from '../tasks/startTrackingBlockchain';
import startUpdatingEngraveCache from '../tasks/startUpdatingEngraveCache';

function tasks() {

    (async () => {
        console.log("Starting in about a second...");
        setTimeout(startTrackingBlockchain, 1000);    
        setTimeout(startUpdatingEngraveCache, 1500);    
    })();
}

export default tasks;