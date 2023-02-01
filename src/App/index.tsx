//###  NPM  ###//
import {Button, HopeProvider} from "@hope-ui/solid"
import {onMount             } from "solid-js"
import {atom                } from "solid-use"
import StartAudioContext      from "startaudiocontext"
import * as Tone              from "tone"


//####################################################################################################################//
//##>  Setup                                                                                                        ##//
//####################################################################################################################//

		type NoteData = [
			note:     Tone.Unit.Frequency,
			duration: number
		]

		let synth: Tone.Synth

		const is_Playing = atom(false)

		const WholeNote_Ticks = 1920 // @ Ableton
		const QuarterNote     = (WholeNote_Ticks / 4 )
		const EighthNote      = (WholeNote_Ticks / 8 )
		const SixteenthNote   = (WholeNote_Ticks / 16)

		const notes: NoteData[] = [
			["C3", QuarterNote],
			["D3", QuarterNote],
			["E3", QuarterNote],
			["F3", QuarterNote],

			["C3", EighthNote],
			["D3", EighthNote],
			["E3", EighthNote],
			["F3", EighthNote],
			["G3", EighthNote],
			["A3", EighthNote],
			["B3", EighthNote],
			["C4", EighthNote],

			["C3", SixteenthNote],
			["D3", SixteenthNote],
			["E3", SixteenthNote],
			["F3", SixteenthNote],
			["G3", SixteenthNote],
			["A3", SixteenthNote],
			["B3", SixteenthNote],
			["C4", SixteenthNote],
			["C4", SixteenthNote],
			["B3", SixteenthNote],
			["A3", SixteenthNote],
			["G3", SixteenthNote],
			["F3", SixteenthNote],
			["E3", SixteenthNote],
			["D3", SixteenthNote],
			["C3", SixteenthNote],
		]


//####################################################################################################################//
//##>  Exports                                                                                                      ##//
//####################################################################################################################//

	export function App(){
		onMount(initialize_Audio)

		return (
			<HopeProvider
				config         = {{initialColorMode:"dark"}}
				enableCssReset = {false                    }
			>

				<Button
					onClick  = {play_Sequence}
					disabled = {is_Playing() }
				>
					{"Play Sequence"}
				</Button>

			</HopeProvider>
		)
	}


//####################################################################################################################//
//##>  Utilities                                                                                                    ##//
//####################################################################################################################//

	function initialize_Audio(){
		StartAudioContext(Tone.context)

		Tone.Transport.bpm.value = 400
		Tone.Transport.start()

		synth = new Tone.Synth().toDestination()
	}

	function play_Sequence(){
		is_Playing(true)

		let scheduledTime = Tone.Transport.ticks

		for(const [note, duration] of notes){
			Tone.Transport.schedule((time) => {
				synth.triggerAttackRelease(note, `${duration}i`, time)
			}, `${scheduledTime}i`)

			scheduledTime += duration
		}

		Tone.Transport.schedule((time) => {
			is_Playing(false)
		}, `${scheduledTime}i`)
	}
