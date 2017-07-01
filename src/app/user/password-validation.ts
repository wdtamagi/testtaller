import {AbstractControl} from '@angular/forms';

export class PasswordValidation {
	static MatchPassword(AC: AbstractControl) {
		let senha = AC.get('senha').value;
		let repeat = AC.get('repeat').value;
		if(senha != repeat) {
				AC.get('repeat').setErrors( {MatchPassword: true} )
		} else {
				return null
		}
	}
}
