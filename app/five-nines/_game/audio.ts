// A few short synthesized sounds. There are no audio files to download, and
// nothing is created until the player turns sound on.

type Note = { freq: number; at: number; length: number; gain: number; wave?: OscillatorType };

const SOUNDS: Record<string, Note[]> = {
    place: [{ freq: 660, at: 0, length: 0.09, gain: 0.05 }],
    erase: [{ freq: 300, at: 0, length: 0.07, gain: 0.04 }],
    deny: [{ freq: 170, at: 0, length: 0.12, gain: 0.05, wave: "triangle" }],
    good: [
        { freq: 523, at: 0, length: 0.12, gain: 0.05 },
        { freq: 784, at: 0.09, length: 0.18, gain: 0.05 },
    ],
    alarm: [
        { freq: 740, at: 0, length: 0.14, gain: 0.05, wave: "triangle" },
        { freq: 554, at: 0.17, length: 0.2, gain: 0.05, wave: "triangle" },
    ],
    over: [
        { freq: 392, at: 0, length: 0.25, gain: 0.06, wave: "triangle" },
        { freq: 311, at: 0.22, length: 0.25, gain: 0.06, wave: "triangle" },
        { freq: 233, at: 0.44, length: 0.5, gain: 0.06, wave: "triangle" },
    ],
};

export class GameAudio {
    private context: AudioContext | null = null;
    enabled = false;

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
        if (enabled && !this.context && typeof AudioContext !== "undefined") {
            this.context = new AudioContext();
        }
        if (enabled) void this.context?.resume();
    }

    play(name: keyof typeof SOUNDS) {
        const context = this.context;
        if (!this.enabled || !context || context.state !== "running") return;
        const now = context.currentTime;
        for (const note of SOUNDS[name]) {
            const osc = context.createOscillator();
            const gain = context.createGain();
            osc.type = note.wave ?? "sine";
            osc.frequency.value = note.freq;
            gain.gain.setValueAtTime(0, now + note.at);
            gain.gain.linearRampToValueAtTime(note.gain, now + note.at + 0.01);
            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                now + note.at + note.length,
            );
            osc.connect(gain).connect(context.destination);
            osc.start(now + note.at);
            osc.stop(now + note.at + note.length + 0.02);
        }
    }

    destroy() {
        void this.context?.close();
        this.context = null;
    }
}
