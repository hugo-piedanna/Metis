import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import {
  ApiErrorItemDto,
  ApiErrorResponseDto,
  ApiSuccessResponseDto,
} from '@/core/swagger/api-envelope.dto';

type ErrorStatus = 400 | 404 | 410 | 500;

const ERRORS: Record<
  ErrorStatus,
  { description: string; message: string; code: string }
> = {
  400: {
    description: 'Requête invalide',
    message: 'Bad Request',
    code: '400',
  },
  404: {
    description: 'Ressource introuvable',
    message: 'Not Found',
    code: '404',
  },
  410: {
    description: 'Ressource soft-deleted',
    message: 'Gone',
    code: '410',
  },
  500: {
    description: 'Erreur serveur',
    message: 'Unexpected error',
    code: 'INTERNAL_ERROR',
  },
};

function errorResponse(status: ErrorStatus) {
  const err = ERRORS[status];
  return ApiResponse({
    status,
    description: err.description,
    schema: { $ref: getSchemaPath(ApiErrorResponseDto) },
    content: {
      'application/json': {
        example: {
          message: err.message,
          data: null,
          errors: [{ code: err.code, type: 'critical' }],
        },
      },
    },
  });
}

export function ApiErrorResponses(...statuses: ErrorStatus[]) {
  return applyDecorators(
    ApiExtraModels(ApiErrorResponseDto, ApiErrorItemDto),
    ...statuses.map((s) => errorResponse(s)),
  );
}

function wrappedSchema(model: Type<unknown>, isArray: boolean) {
  return {
    allOf: [
      { $ref: getSchemaPath(ApiSuccessResponseDto) },
      {
        properties: {
          data: isArray
            ? { type: 'array', items: { $ref: getSchemaPath(model) } }
            : { $ref: getSchemaPath(model) },
          errors: { type: 'array', example: [] },
        },
      },
    ],
  };
}

export function ApiWrappedOk(model: Type<unknown>) {
  return applyDecorators(
    ApiExtraModels(ApiSuccessResponseDto, ApiErrorItemDto, model),
    ApiOkResponse({ description: 'OK', schema: wrappedSchema(model, false) }),
  );
}

export function ApiWrappedOkArray(model: Type<unknown>) {
  return applyDecorators(
    ApiExtraModels(ApiSuccessResponseDto, ApiErrorItemDto, model),
    ApiOkResponse({
      description: 'OK',
      schema: wrappedSchema(model, true),
    }),
  );
}

export function ApiWrappedCreated(model: Type<unknown>) {
  return applyDecorators(
    ApiExtraModels(ApiSuccessResponseDto, ApiErrorItemDto, model),
    ApiCreatedResponse({
      description: 'Créé',
      schema: wrappedSchema(model, false),
    }),
  );
}

export function ApiWrappedOkNull() {
  return applyDecorators(
    ApiExtraModels(ApiSuccessResponseDto),
    ApiOkResponse({
      description: 'OK',
      content: {
        'application/json': {
          example: { message: 'Deleted', data: null, errors: [] },
        },
      },
    }),
  );
}
