
function loadSplashAd(that,codeId,callback){
	that.load(codeId,
		(res) => {
			var adEvent = res.adEvent;
			if(adEvent == 1 && callback.hasOwnProperty('onAdLoaded')){
				callback.onAdLoaded();
			} else if(adEvent == 2 && callback.hasOwnProperty('onAdShow')) {
				callback.onAdShow();
			} else if (adEvent == 3 && callback.hasOwnProperty('onAdClick')) {
				callback.onAdClick();
			} else if (adEvent == 4 && callback.hasOwnProperty('onAdError')) {
				callback.onAdError(res.errorCode,res.errorMessage);
			} else if (adEvent == 5 && callback.hasOwnProperty('onAdClosed')) {
				callback.onAdClosed();
			}
		}
	);
}
function loadBannerAd(that, codeId, callback) {
	that.load(codeId,
		(res) => {
			var adEvent = res.adEvent;
			if(adEvent == 1 && callback.hasOwnProperty('onAdLoaded')){
				callback.onAdLoaded();
			} else if(adEvent == 2 && callback.hasOwnProperty('onAdShow')) {
				callback.onAdShow();
			} else if (adEvent == 3 && callback.hasOwnProperty('onAdClick')) {
				callback.onAdClick();
			} else if (adEvent == 4 && callback.hasOwnProperty('onAdError')) {
				callback.onAdError(res.errorCode,res.errorMessage);
			} else if (adEvent == 5 && callback.hasOwnProperty('onAdClosed')) {
				callback.onAdClosed();
			}
		}
	);
}

function loadInterstitialAd(codeId, callback) {
	var adModule = uni.requireNativePlugin("AdModule");
	adModule.loadInter(codeId,
		(res) => {
			var adEvent = res.adEvent;
			if(adEvent == 1 && callback.hasOwnProperty('onAdLoaded')){
				callback.onAdLoaded();
			} else if(adEvent == 2 && callback.hasOwnProperty('onAdShow')) {
				callback.onAdShow();
			} else if (adEvent == 3 && callback.hasOwnProperty('onAdClick')) {
				callback.onAdClick();
			} else if (adEvent == 4 && callback.hasOwnProperty('onAdError')) {
				callback.onAdError(res.errorCode,res.errorMessage);
			} else if (adEvent == 5 && callback.hasOwnProperty('onAdClosed')) {
				callback.onAdClosed();
			}
		}
	)
}

function loadRewardVideoAd(adCode, callback) {
	var adModule = uni.requireNativePlugin("AdModule");
	adModule.loadRewardVideo(adCode.codeId,adCode.userId,adCode.ext,
		(res) => {
			var adEvent = res.adEvent;
			if(adEvent == 1 && callback.hasOwnProperty('onAdLoaded')){
				callback.onAdLoaded();
			} else if(adEvent == 2 && callback.hasOwnProperty('onAdShow')) {
				callback.onAdShow();
			} else if (adEvent == 3 && callback.hasOwnProperty('onAdClick')) {
				callback.onAdClick();
			} else if (adEvent == 4 && callback.hasOwnProperty('onAdError')) {
				callback.onAdError(res.errorCode,res.errorMessage);
			} else if (adEvent == 5 && callback.hasOwnProperty('onAdClosed')) {
				callback.onAdClosed();
			} else if (adEvent == 6 && callback.hasOwnProperty('onAdVideoComplete')) {
				callback.onAdVideoComplete();
			} else if (adEvent == 7 && callback.hasOwnProperty('onAdReward')) {
				callback.onAdReward();
			}
		}
	)
}


export default {
	loadSplashAd,
	loadBannerAd,
	loadInterstitialAd,
	loadRewardVideoAd
}

