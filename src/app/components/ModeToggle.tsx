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
            className="w-full mb-4 py-2 cursor-pointer bg-[#393251]/70 backdrop-blur-sm rounded-xl border border-[#615472]/50 text-white flex items-center justify-center gap-2 text-sm"
        >
            {isVoiceMode ? (
                <>
                    <Image
                        src="/icons/microphone.svg"
                        alt="Microphone Icon"
                        width={16}
                        height={16}
                    />
                    <span>Voice mode</span>
                </>
            ) : (
                <>
                    <Image
                        src="/icons/keyboard.svg"
                        alt="Keyboard Icon"
                        width={16}
                        height={16}
                    />
                    <span>Text mode</span>
                </>
            )}
        </button>
    );
};

export default ModeToggle; 