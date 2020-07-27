import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FogotpasswordRoutingModule } from './fogotpassword-routing.module';
import { FogotpasswordComponent } from './fogotpassword.component';


@NgModule({
  declarations: [FogotpasswordComponent],
  imports: [
    CommonModule,
    FogotpasswordRoutingModule
  ]
})
export class FogotpasswordModule { }
