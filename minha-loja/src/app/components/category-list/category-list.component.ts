import { Component, EventEmitter, Output, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  @Output() categorySelected = new EventEmitter<string>();
  private categoryService = inject(CategoryService);
  categories = toSignal(this.categoryService.getCategories(), {initialValue: []});

  selectCategory(category: string) {
    this.categorySelected.emit(category);
  }
}
