import { Repository, EntityRepository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDTO } from './dto/create-category.dto';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async createCategory(createCategoryDTO: CreateCategoryDTO): Promise<any> {
    const category = Category.create(createCategoryDTO);

    await category.save();

    return category;
  }
}
