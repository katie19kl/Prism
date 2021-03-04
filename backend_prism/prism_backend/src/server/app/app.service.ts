import { Injectable, Param } from '@nestjs/common';

@Injectable()
export class AppService {
	getHello(): string {
		console.log("I am app service !!!")
		return 'Hello World!';
	}

	findOne(@Param('id') id: string) : string {
		return `this is hello from me, with your param: #${id}. `
	}
}
