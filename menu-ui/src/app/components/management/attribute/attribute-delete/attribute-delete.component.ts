import { Component,Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable,  } from 'rxjs';
import {AttributeService} from '../../../../services/attribute/attribute.service';
@Component({
  selector: 'attribute-delete-component',
  templateUrl: './attribute-delete.component.html',
  styleUrls: ['./attribute-delete.component.scss'],
  
})
export class AttributeDeleteComponent implements OnInit {
  cannotDeleteItem:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AttributeDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public attributeService: AttributeService
  ) {
  }

  ngOnInit() {
    this.dialogRef.updatePosition({  top: '100px' })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  removeAttribute():void{
    this.attributeService.deleteAttribute(this.data.tag).subscribe((res)=>{
        if(res.status){
          this.onNoClick();
      }else{
          this.cannotDeleteItem = true;
      }
    })
  }


}
