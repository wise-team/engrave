import healthApi from "../routes/health/health.routes";
import walletApi from "../routes/wallet/wallet.routes";

function routes(app:any) {
    app.use('/health', healthApi);
    app.use('/wallet', walletApi);
}

export default routes;
