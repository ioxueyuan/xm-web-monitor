import { listening } from './utils';
import { reportApi, reportApiError } from './api';
import { reportError, initError } from './error';
import { reportSpeed, initSpeed } from './speed';
import { reportUrlError } from './url_error';
import { reportWhiteScreen, initWhiteScreen } from './white_screen';
import { reportResourceFail, initResourceFail } from './resource_fail';
import catchMonitor from './catch_monitor';
import { setMonitorOption } from './utils/monitorReport';

declare const window: any;

if (window) {
	try {
		listening(() => {
			initError();
			initSpeed();
			initWhiteScreen();
			initResourceFail();

			window.reportApi = reportApi;
			window.reportApiError = reportApiError;
			window.reportError = reportError;
			window.reportSpeed = reportSpeed;
			window.reportUrlError = reportUrlError;
			window.reportWhiteScreen = reportWhiteScreen;
			window.reportResourceFail = reportResourceFail;

			window.setMonitorOption = setMonitorOption;
		});
	} catch (err) {
		catchMonitor(err.message, 1.1);
	}
}

export default {
	reportApi,
	reportError,
	reportSpeed,
	reportUrlError,
	reportWhiteScreen,
	reportResourceFail,
	setMonitorOption,
};
