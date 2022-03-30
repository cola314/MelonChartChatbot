import { Music } from "./Music";

export class Chart {
	constructor(
		public name: string,
		public musics: Music[]
	) { }

	public toDescription(): string {
		return this.name +
			"\n" +
			this.musics
				.map((music, i) => `${i + 1}. ${music.name} - ${music.singer}`)
				.join('\n');
	}
}