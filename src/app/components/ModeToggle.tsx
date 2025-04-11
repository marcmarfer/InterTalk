import React from 'react';
import Image from 'next/image';

interface ModeToggleProps {
    isVoiceMode: boolean;
    onToggle: () => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({
    isVoiceMode,
    onToggle
}) => {
    return (
        <button
            onClick={onToggle}
            className="w-full mb-6 py-3 cursor-pointer bg-[#393251]/70 backdrop-blur-sm rounded-2xl border border-[#615472]/50 text-white flex items-center justify-center gap-3"
        >
            {isVoiceMode ? (
                <>
                    <Image
                        src="/icons/microphone.svg"
                        alt="Microphone Icon"
                        width={20}
                        height={20}
                    />
                    <span>Voice mode</span>
                </>
            ) : (
                <>
                    <Image
                        src="/icons/keyboard.svg"
                        alt="Keyboard Icon"
                        width={20}
                        height={20}
                    />
                    <span>Text mode</span>
                </>
            )}
        </button>
    );
};

export default ModeToggle; 