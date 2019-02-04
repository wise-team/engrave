import healthApi from "../routes/health/health.routes";
import walletApi from "../routes/wallet/wallet.routes";
import coinsApi from "../routes/coins/coins.routes";

function routes(app:any) {
    app.use('/health', healthApi);
    app.use('/wallet', walletApi);
    app.use('/coins', coinsApi);
}

export default routes;
