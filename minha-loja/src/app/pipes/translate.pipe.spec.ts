import { TranslatePipe } from './translate.pipe';
import {TranslationService} from "../services/translation.service";

describe('TranslatePipe', () => {
  // @ts-ignore
  it('create an instance', (private translationService: TranslationService) => {
    const pipe = new TranslatePipe(translationService);
    expect(pipe).toBeTruthy();
  });
});
