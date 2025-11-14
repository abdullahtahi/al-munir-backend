import { CoursesService } from './courses.service';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(createCourseDto: any): Promise<{
        branch: any;
        message: string;
    }>;
    findAll(params: any): any;
    findOne(id: string): string;
    update(id: string, updateCourseDto: any): any;
    remove(id: string): any;
}
