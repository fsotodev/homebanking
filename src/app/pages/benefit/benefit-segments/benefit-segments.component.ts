import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { BenefitsService } from '@apps/services/benefits.service';
import { FirebaseService } from '@apps/services/firebase.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Group } from '@apps/models/group';
import { BenefitSegment } from '@apps/models/benefit';
import { MatTabChangeEvent } from '@angular/material/tabs';


@Component({
  selector: 'app-benefit-segments',
  templateUrl: './benefit-segments.component.html',
  styleUrls: ['./benefit-segments.component.scss']
})
export class BenefitSegmentsComponent implements OnInit {
  @ViewChild('table') table: MatTable<Group>;
  @ViewChild('tableun') tableUncategorized: MatTable<Group>;
  public isLoading = true;
  public dragEnabled = false;
  public isEditing = false;
  public displayedColumns = [
    'order',
    'title',
    'description',
    'icon',
    'delete'
  ];
  public displayedUncategorizedColumns = [
    'order',
    'title',
    'icon',
    'delete'
  ];

  public tabSelected = 0;
  public tabUncategorizedSelected = 0;
  public segmentSelected = 0;
  public segments: BenefitSegment[] = [];
  public segmentsBack: BenefitSegment[] = [];
  public tabs = [];
  public uncategorizedTabs = [
    {
      id: 'gold',
      title: 'Gold'
    },
    {
      id: 'silver',
      title: 'Silver'
    },
    {
      id: 'bronze',
      title: 'Plus'
    },
  ];
  public isUploading = false;
  public loading = false;

  constructor(
    private benefitService: BenefitsService,
    private firebaseService: FirebaseService,
    private modalDialogService: ModalDialogService
  ) { }

  async ngOnInit() {
    this.loading = true;
    await this.getBenefitSegments();
    this.setTabs();
    this.loading = false;
  }
  getBenefitSegments = async () => {
    this.segments = await this.benefitService.getSegments();
  };

  setTabs = () => {
    const ids = this.segments.map(s => s.id);
    for (const id of ids) {
      const title = this.getTabTitle(id);
      if (title) {
        this.tabs.push({id, title});
      }
    }
  };
  getTabTitle = (id: string) => {
    let title = '';
    switch (id) {
    case 'gold': title = 'Gold'; break;
    case 'silver': title = 'Silver'; break;
    case 'bronze': title = 'Plus'; break;
    case 'gold-silver': title = 'Sin Categoría'; break;
    default: title = null; break;
    }
    return title;
  };

  tabChanged(tabEvent: MatTabChangeEvent) {
    this.tabSelected = tabEvent.index;
    const tabId = this.tabs[this.tabSelected].id;
    this.segmentSelected = this.segments.findIndex(s => s.id === tabId);
  }

  tabUncategorizedChanged(tabEvent: MatTabChangeEvent) {
    this.tabUncategorizedSelected = tabEvent.index;
  }

  toggleEditing = () => {
    this.segmentsBack = JSON.parse(JSON.stringify(this.segments));
    this.isEditing = true;
  };

  cancelEditing = () => {
    this.segments = [...this.segmentsBack];
    this.segmentsBack = [];
    this.isEditing = false;
  };

  dropTable(event: CdkDragDrop<Group[]>, tabId: string) {
    const prevIndex = this.segments[this.segmentSelected].benefits.findIndex((d) => d === event.item.data);
    moveItemInArray(this.segments[this.segmentSelected].benefits, prevIndex, event.currentIndex);
    this.table.renderRows();
  }
  dropUncategorizedTable(event: CdkDragDrop<Group[]>, tabId: string) {
    const prevIndex = this.segments[this.segmentSelected][tabId].findIndex((d) => d === event.item.data);
    moveItemInArray(this.segments[this.segmentSelected][tabId], prevIndex, event.currentIndex);
    this.tableUncategorized.renderRows();
  }


  saveChanges = async () => {
    try {
      this.loading = true;
      const batch = this.firebaseService.getNewBatch();
      this.segments.forEach(seg => {
        const ref = this.firebaseService.getFirebaseCollection('PWA-benefits-ripley-points-go').doc(seg.id).ref;
        const obj = {...seg};
        delete obj.id;
        batch.set(ref, obj);
      });
      await batch.commit();
      await this.getBenefitSegments();
      this.loading = false;

      this.segmentsBack = [];
      this.isEditing = false;
    } catch (error) {
      console.log('Error al guardar los cambios');
      console.error(error);
      this.loading = false;
    }

  };
  uploadSegmentImage(event: FileList, index: number) {
    if (event.length <= 0) {
      this.segments[this.segmentSelected].benefits[index].icon = '';
      return;
    }
    this.isUploading = true;
    this.firebaseService.uploadFileToFireStorage(event[0], 'benefits')
      .then((urlImage: string) => {
        this.isUploading = false;
        this.segments[this.segmentSelected].benefits[index].icon = urlImage;
      })
      .catch(() => {
        this.isUploading = false;
        this.modalDialogService.openModal('genericError')
          .then((btnPressed) => {
            if (btnPressed === 'right') {
              this.uploadSegmentImage(event, index);
            }
          });
      });
  };
  uploadUncategorizedSegmentImage(event: FileList, index: number, tabId: string) {
    if (event.length <= 0) {
      this.segments[this.segmentSelected].benefits[index].icon = '';
      return;
    }
    this.isUploading = true;
    this.firebaseService.uploadFileToFireStorage(event[0], 'benefits')
      .then((urlImage: string) => {
        this.isUploading = false;
        this.segments[this.segmentSelected][tabId][index].icon = urlImage;
      })
      .catch(() => {
        this.isUploading = false;
        this.modalDialogService.openModal('genericError')
          .then((btnPressed) => {
            if (btnPressed === 'right') {
              this.uploadSegmentImage(event, index);
            }
          });
      });
  };
  deleteSegment = (index) => {
    const benefits =  [... this.segments[this.segmentSelected].benefits];
    benefits.splice(index, 1);
    this.segments[this.segmentSelected].benefits = benefits;
    this.table.renderRows();
  };
  deleteUncategorizedSegment = (index, tabId) => {
    const benefits = [... this.segments[this.segmentSelected][tabId]];
    benefits.splice(index, 1);
    this.segments[this.segmentSelected][tabId] = benefits;
    this.tableUncategorized.renderRows();
  };
  addRow = () => {
    this.segments[this.segmentSelected].benefits = [ ... this.segments[this.segmentSelected].benefits,
      {title: '', description: '', icon: ''} ];
    this.table.renderRows();
  };
  addUncategorizedRow = (tabId) => {
    this.segments[this.segmentSelected][tabId] = [... this.segments[this.segmentSelected][tabId], {title: '', icon: ''}];
    this.tableUncategorized.renderRows();
  };
}
