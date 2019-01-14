import IUpdate from './IUpdate';

export default (update: IUpdate, arr: IUpdate[]) => {
    const existingUpdate = arr.find( (testedUpdate) => {
        return (testedUpdate.author == update.author && testedUpdate.permlink == update.permlink)
    })
    return existingUpdate;
}