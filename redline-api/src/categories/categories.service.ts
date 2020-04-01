import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from './category.repository';
import { Category } from './category.entity';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['parentCategory', 'childCategories'],
    });
  }

  async createCategory(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    return this.categoryRepository.createCategory(createCategoryDTO);
  }

  async getCategory(name: string): Promise<Category> {
    return this.categoryRepository.findOne({ name });
  }

  async deleteCategory(name: string): Promise<void> {
    const result = await this.categoryRepository.delete({ name });
    if (result.affected === 0)
      throw new NotFoundException(`Cannot find a category to delete`);
  }

  async updateCategory(
    name: string,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<Category> {
    const result = await this.categoryRepository.update(
      { name },
      updateCategoryDTO,
    );
    if (result.affected === 0)
      throw new NotFoundException(`Cannot find a category to update`);
    return this.getCategory(updateCategoryDTO.name);
  }
}
