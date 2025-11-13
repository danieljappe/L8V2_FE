import React, { useState } from 'react';
import CookieConsentBanner from './CookieConsentBanner';

interface CookieSettingsButtonProps {
	className?: string;
	label?: string;
}

const CookieSettingsButton: React.FC<CookieSettingsButtonProps> = ({
	className,
	label = 'Cookie indstillinger'
}) => {
	const [showBanner, setShowBanner] = useState(false);

	const handleOpen = () => {
		setShowBanner(true);
	};

	return (
		<>
			<button
				onClick={handleOpen}
				className={
					className ||
					'fixed bottom-4 right-4 z-40 rounded-full bg-white/10 text-white backdrop-blur-md px-4 py-2.5 text-sm font-medium hover:bg-white/20 transition-all shadow-lg hover:shadow-xl'
				}
				aria-label="Åbn cookie indstillinger"
			>
				{label}
			</button>
			{showBanner && <CookieSettingsManager onClose={() => setShowBanner(false)} />}
		</>
	);
};

// CookieSettingsManager Component
interface CookieSettingsManagerProps {
	onClose: () => void;
}

const CookieSettingsManager: React.FC<CookieSettingsManagerProps> = ({ onClose }) => {
	const [preferences, setPreferences] = useState(() => {
		const saved = localStorage.getItem('cookieConsent');
		return saved ? JSON.parse(saved) : { necessary: true, analytics: false, marketing: false };
	});

	const savePreferences = () => {
		localStorage.setItem('cookieConsent', JSON.stringify(preferences));
		localStorage.setItem('cookieConsentDate', new Date().toISOString());
		window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: preferences }));
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
			<CookieConsentBanner />
		</div>
	);
};

export default CookieSettingsButton;


