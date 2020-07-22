import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';

@Controller('articles')
@ApiTags('Articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  // Get Articles

  // Get Article by ID/slug

  // Create article

  // Update article

  // Delete article
}
