import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateReportDTO } from './dto/create-report.dto';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportRepository } from './repositories/report.repository';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportRepository)
    private reportRepository: ReportRepository,
  ) {}

  async create(reportDTO: CreateReportDTO, user: User) {
    const report = this.reportRepository.create(reportDTO);
    report.reportedBy = user;
    await report.save();

    return report;
  }

  groupBy = key => array =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = obj[key];
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});

  async getAll(user: User) {
    if (!user.isAdmin()) throw new UnauthorizedException();
    const reports = await this.reportRepository.find({
      relations: ['reportedBy'],
    });
    const groupedByURL = this.groupBy('url');
    return groupedByURL(reports);
  }
}
