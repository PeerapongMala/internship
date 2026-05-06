package lab.microservice.currencyconversion;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "forex-service")
@LoadBalancerClient(name = "forex-service",configuration=LoadBalancerConfiguration.class)
@EnableDiscoveryClient
public interface CurrencyExchangeServiceProxy {
	
  @GetMapping("/currency-exchange/from/{from}/to/{to}")
  public CurrencyConversionBean retrieveExchangeValue(@PathVariable String from,@PathVariable String to);

}
