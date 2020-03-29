package com.dhq.utils;

import org.springframework.http.HttpStatus;

public class ResultStatus {
		
	    public static final int PARAMETER_ERROR = -1;

		/**
	     * 返回码
	     */
	    private int code;

	    /**
	     * 返回结果描述
	     */
	    private String message;
	    
	    public ResultStatus() {
		}

		public ResultStatus(int code, String message) {
	        this.code = code;
	        this.message = message;
	    }
		
		public ResultStatus(HttpStatus status) {
	        this.code = status.value();
	        this.message = status.getReasonPhrase();
	    }
		
	    public int getCode() {
	        return code;
	    }

	    public void setCode(int code) {
	        this.code = code;
	    }

	    public String getMessage() {
	        return message;
	    }

	    public void setMessage(String message) {
	        this.message = message;
	    }
	    
	    public static ResultStatus _200(){
	    	return new ResultStatus(HttpStatus.OK);
	    }
	    
	    public static ResultStatus _1000(){
	    	return new ResultStatus(1000,"参数错误");
	    }

		public static ResultStatus _500() {
			// TODO Auto-generated method stub
			return new ResultStatus(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	    
}
