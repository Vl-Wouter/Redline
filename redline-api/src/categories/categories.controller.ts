import {
  Controller,
  Get,
  UseGuards,
  Post,
  Param,
  Delete,
  Body,
  Patch,
} from '@nestjs/common';
import { Category } from './category.entity';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ operationId: 'Get all categories' })
  @ApiOkResponse({
    description: 'Found all categories',
    type: Category,
    isArray: true,
  })
  getCategories(): Promise<Category[]> {
    return this.categoriesService.getCategories();
  }

  @Post()
  @UseGuards(AuthGuard())
  @ApiOperation({ operationId: 'Create a category' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateCategoryDTO })
  @ApiCreatedResponse({
    description: 'Category has successfully been created',
    type: Category,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authorized to create categories',
  })
  createCategory(
    @Body() createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> | void {
    return this.categoriesService.createCategory(createCategoryDTO);
  }

  @Get('/:name')
  @ApiOperation({ operationId: 'Get a category by name' })
  @ApiOkResponse({ description: 'Category found', type: Category })
  @ApiNotFoundResponse({ description: 'Category not found' })
  getCategory(@Param('name') name: string): Promise<Category> {
    return this.categoriesService.getCategory(name);
  }

  @Delete('/:name')
  @UseGuards(AuthGuard())
  @ApiOperation({ operationId: 'Delete a category by name' })
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'Category successfully deleted' })
  @ApiUnauthorizedResponse({
    description: 'User is not authorized to delete categories',
  })
  @ApiNotFoundResponse({ description: 'Cannot find category to delete' })
  deleteCategory(@Param('name') name: string): Promise<void> {
    return this.categoriesService.deleteCategory(name);
  }

  @Patch('/:name')
  @UseGuards(AuthGuard())
  @ApiOperation({ operationId: 'Update a category by name' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateCategoryDTO })
  @ApiOkResponse({
    description: 'Category successfully updated',
    type: Category,
  })
  @ApiNotFoundResponse({ description: 'Cannot find category to update' })
  @ApiUnauthorizedResponse({
    description: 'User is not authorized to update categories',
  })
  updateCategory(
    @Param('name') name: string,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
  ) {
    return this.categoriesService.updateCategory(name, updateCategoryDTO);
  }
}
